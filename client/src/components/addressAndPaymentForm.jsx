// import React from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate, useLocation } from "react-router-dom";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createRazorPayOrder, initializeRazorpayPayment } from "../utils/razorpayHandler";


const API_BASE = import.meta.env.VITE_API_BASE;
export const api = axios.create({
  baseURL: API_BASE || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});


export default function AddressForm(/*{ productPrice }*/) {
  const {
    register,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { state } = useLocation();
  const [shippingCost, setShippingCost] = useState(0);
  const [totalAmount, setTotalAmount] = useState(state?.price);
  // eslint-disable-next-line no-unused-vars
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [dbOrderId, setDbOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Paypal");




  // for handling the form submission
  const onSubmit = async (data) => {
    try {
      const payload = {
        origin: {
          streetLines: [/*data.shipper.address.street ||*/ "Ratanada Road"],
          city: /*data.shipper.address.city ||*/ "Jodhpur",
          state: /*data.shipper.address.state ||*/ "RJ",
          postalCode: /*data.shipper.address.postalCode ||*/ "342011",
          countryCode: /*data.shipper.address.countryCode ||*/ "IN",
          residential: false,
        },
        destination: {
          streetLines: [data.recipient.address.street || "456 Queen St"],
          city: data.recipient.address.city || "Toronto",
          state: data.recipient.address.state || "ON",
          postalCode: data.recipient.address.postalCode || "M5H 2N2",
          countryCode: data.recipient.address.countryCode || "CA",
          residential: data.recipient.address.residential,
        },
        packages: [
          {
            weight: {
              units: "KG",
              value: 0.4,
            },
            dimensions: {
              length: 4,
              width: 3,
              height: 2,
              units: "IN",
            },
          },
        ],
        serviceType: data.recipient.address.countryCode == "IN" ? "STANDARD_OVERNIGHT" : "FEDEX_INTERNATIONAL_PRIORITY", // Optional
      };

      const res = await api.post(`/fedex/rates`, payload);
      console.log(res.data);

      // how can I use this price to send over to the paypal where it also access base price of the product
      const totalNetCharge =
        res.data?.data?.output?.rateReplyDetails[0]?.ratedShipmentDetails[0]
          ?.totalNetCharge;

      const shippingCostValue = parseFloat(totalNetCharge || 0);
      setShippingCost(shippingCostValue);

      const newAmount = state?.price + shippingCostValue;
      setTotalAmount(newAmount);
      setOrderDetails(data);
      setShowPaymentButton(true);
      setPaymentMethod(data.paymentMethod);

      console.log(totalNetCharge, totalAmount);
      alert("Submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed!");
    }
  };

  /// 🚩 here it handles the creation of orderes for the
  const createOrder = async () => {
    try {
      console.log("Creating PayPal order with amount:", totalAmount);

      const response = await api.post(`/paypal/create-order`, {
        amount: totalAmount.toFixed(2).toString(),
        // description : "This is amount for the product"
        userId: "dummy-user-id-or-actual-user-id",
        items: [
          {
            product: "handmade-small-bag",
            price: state?.price,
            quantity: 1,
          },
        ],
      });
      const paypalOrderId = response.data?.paypalOrderId;
      const orderId = response.data?.dbOrderId;
      setDbOrderId(orderId);
      return paypalOrderId;
      // return response.data?.paypalOrderId;
    } catch (error) {
      console.error("Error creating Paypal order ", error);
      throw error;
    }
  };

  /// 🚜👍 Here it handles the when the payment is approved from the
  // eslint-disable-next-line no-unused-vars
  const onApprove = async (data, actions) => {
    try {
      if (!dbOrderId) {
        alert("Order ID not found. Payment cannot be processed.");
        return;
      }
      const details = await actions.order.capture(); // 🟢 Proper capture with full details
      const payer = details?.payer;

      const captureId =
        details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      // eslint-disable-next-line no-unused-vars
      const updateTime = details?.update_time;
      const givenName = payer?.name?.given_name;
      const surname = payer?.name?.surname;
      const response = await axios.post(
        `${API_BASE}/paypal/${dbOrderId}/capture`,
        {
          captureId,
          payerId: data.payerID,
          emailAddress: payer?.email_address || "unknown@example.com",
          givenName,
          surname,
          status: "COMPLETED",
          paidAt: new Date().toISOString(),
        }
      );
      setOrderDetails(response.data);
      alert("Payment Successful");
      navigate("/order-confirmed", {
        state: {
          orderDetails,
          totalAmount,
          shippingCost,
          paymentMethod,
          currency : state?.currency

        },
      });
      console.log("Order Completed", response.data);
    } catch (error) {
      console.error("Error capturing payment:", error);
      alert("Payment failed!");
    }
  };

  /// for handling razorpay_payment 
  const handleRazorpayPayment = async () => {
    try {
      // Create order with Razorpay
      const orderResponse = await createRazorPayOrder({
        totalAmount: totalAmount,
        userId: "dummy-user-id-or-actual-user-id",
        currency: state?.currency,
        products: [
          {
            product: "handmade-small-bag",
            price: state?.price,
            quantity: 1,
          },
        ],
        shipping: {
          name: orderDetails.recipient.name,
          phone: orderDetails.recipient.phone,
          email: orderDetails.recipient.email,
          address: orderDetails.recipient.address
        }
      });

      // Initialize Razorpay payment
      await initializeRazorpayPayment(
        orderResponse, // Pass the entire response object
        // Success callback
        (paymentResult) => {
          alert("Payment Successful");
          navigate("/order-confirmed", {
            state: {
              orderDetails,
              totalAmount,
              shippingCost,
              paymentMethod,
              paymentDetails: paymentResult.data,
              currency : state?.currency
            },
          });
        },
        // Error callback
        (error) => {
          console.error("Payment failed:", error);
          if (error.message === "Payment cancelled by user") {
            alert("Payment was cancelled. Please try again.");
          } else {
            alert("Payment failed: " + error.message);
          }
        }
      );
    } catch (error) {
      console.error("Razorpay payment failed:", error);
      alert("Payment failed: " + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 p-6 shadow-black bg-white rounded-lg shadow-lg ">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        {/* <h2 className="text-xl font-bold">Shipper Info</h2>
        <input
          {...register("shipper.name")}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          {...register("shipper.company")}
          placeholder="Company"
          className="border p-2 w-full"
        />
        <input
          {...register("shipper.phone")}
          placeholder="Phone"
          className="border p-2 w-full"
        />
        <input
          {...register("shipper.address.street")}
          placeholder="Street"
          className="border p-2 w-full"
        />
        <input
          {...register("shipper.address.city")}
          placeholder="City"
          className="border p-2 w-full"
        />
        <input
          {...register("shipper.address.state")}
          placeholder="State"
          className="border p-2 w-full"
        />
        <input
          {...register("shipper.address.postalCode")}
          placeholder="Postal Code"
          className="border p-2 w-full"
        />
        <input
          {...register("shipper.address.countryCode")}
          placeholder="Country Code"
          className="border p-2 w-full"
        /> */}

        <h2 className="text-xl font-bold">Recipient Info</h2>
        <input
          {...register("recipient.name")}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          {...register("recipient.company")}
          placeholder="Company"
          className="border p-2 w-full"
        />
        <input
          {...register("recipient.phone")}
          placeholder="Phone"
          className="border p-2 w-full"
        />
        <input
          {...register("recipient.address.street")}
          placeholder="Street"
          className="border p-2 w-full"
        />
        <input
          {...register("recipient.address.city")}
          placeholder="City"
          className="border p-2 w-full"
        />
        <input
          {...register("recipient.address.state")}
          placeholder="State"
          className="border p-2 w-full"
        />
        <input
          {...register("recipient.address.postalCode")}
          placeholder="Postal Code"
          className="border p-2 w-full"
        />
        <input
          {...register("recipient.address.countryCode")}
          placeholder="Country Code"
          className="border p-2 w-full"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("recipient.address.residential")}
          />
          Residential
        </label>

        <h2 className="text-xl font-bold">Payment</h2>
        <select {...register("paymentMethod")} className="border p-2 w-full">
          <option value="">Choose payment</option>
          <option value="RazorPay">RazorPay</option>
          <option value="PayPal">PayPal</option>
          {/* <option value="UPI">UPI</option> */}
          <option value="CashOnDelivery">Cash on Delivery</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

        {
          //paypal button shown after submittion
          showPaymentButton && (
            <div className="mt-4">
              <div className="mb-4">
                <p>Product Price: {state?.price.toFixed(2)} {state?.currency}</p>
                <p>Shipping Cost: {shippingCost.toFixed(2)} {state?.currency}</p>
                <p className="font-bold">
                  Total Amount: {totalAmount.toFixed(2)} {state?.currency}
                </p>
              </div>
            {paymentMethod == "PayPal" && (
              <PayPalScriptProvider options={{
                "client-id": import.meta.env.VITE_APP_PAYPAL_CLIENT_ID,
                currency: state?.currency || "USD",
                intent: "capture"
              }}>

                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                />
                {/* Your other components */}
                {/* <AddressForm /> Pass your actual product price /*productPrice={1} */}
              </PayPalScriptProvider>
            )
          }


          {
            paymentMethod === "RazorPay" && (
              <button 
                type="button" 
                onClick={handleRazorpayPayment}
                className="w-full h-auto py-2 text-2xl bg-blue-800 text-white rounded"
              > 
                <p>Pay {totalAmount} {state?.currency}</p> 
                <p className="text-sm">With Razorpay</p>
              </button>
            )
          }
            </div>
          )
        }
      </form>
    </div>
  );
}
