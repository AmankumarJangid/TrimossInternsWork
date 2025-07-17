import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useNavigate, useLocation } from "react-router-dom";
import { createRazorPayOrder, initializeRazorpayPayment } from "../utils/razorpayHandler";
import { useSelector } from "react-redux"; // If you want to use userId from Redux

// added country selector 
import CountryStateSelector from "./countryStateSelector";

const API_BASE = import.meta.env.VITE_API_BASE;

export const api = axios.create({
  baseURL: API_BASE || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default function AddressForm() {
  const {
    register,
    handleSubmit,
    setValue, // for country, state, dialCode
    watch, // for dial-up code
    formState: { errors },

  } = useForm({ //dial up code 
    defaultValues: {
      recipient: {
        address: {
          countryCode: "",
          state: "",
          dialCode: "", // Add this
          phone: "",
        },
      },
    },
  });


  const navigate = useNavigate();

  //   const role = "user";
  const { user, token } = useSelector((state) => state.auth); // added user and token access 
  const { state } = useLocation();
  const [shippingCost, setShippingCost] = useState(0);
  const [totalAmount, setTotalAmount] = useState(state?.price || 0);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [dbOrderId, setDbOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  //country code selector 
  const [recipientLocation, setRecipientLocation] = useState({
    country: null,
    state: null,
  });

  // const user = useSelector(state => state.auth.user); // Optionally get user ID

  const onSubmit = async (data) => {
    alert("submit button pressed");
    try {
      const address = data?.recipient?.address;
      if (!address) {
        console.error("Recipient address is missing");
        return;
      }

      // Proceed safely using `address`
      console.log("Country:", address.countryCode);
      console.log("State:", address.state);
      console.log("Phone:", address.phone);
      console.log("StateCode " , address.stateCode);

      const payload = {
        origin: {
          streetLines: [/*data.shipper.address.street ||*/ "Ratanada Road"],
          city: /*data.shipper.address.city || */"Jodhpur",
          state: /*data.shipper.address.stateCode || */"RJ",
          postalCode: /*data.shipper.address.postalCode || */"342011",
          countryCode: /*data.shipper.address.countryCode ||*/ "IN",
          residential: false,
        },
        destination: {
          streetLines: [data.recipient.address.street || "456 Queen St"],
          city: data.recipient.address.city || "Toronto",
          state: data.recipient.address.stateCode.toUpperCase() || "ON",
          postalCode: data.recipient.address.postalCode.toUpperCase() || "M5H 2N2",
          countryCode: data.recipient.address.countryCode.toUpperCase() || "CA",
          residential: data.recipient.address.residential,
        },
        packages: [
          {
            weight: { units: "KG", value: 0.4 },
            dimensions: { length: 4, width: 3, height: 2, units: "IN" },
          },
        ],
        serviceType:
          data.recipient.address.countryCode.toUpperCase() === "IN"
            ? "STANDARD_OVERNIGHT"
            : "FEDEX_INTERNATIONAL_PRIORITY",
      };

      const res = await api.post(`/fedex/rates`, payload);
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
    } catch (err) {
      console.error(err);
      alert("Failed to calculate shipping.");
    }
  };

  const createOrder = async () => {
    try {
      const response = await api.post(`/paypal/create-order`, {
        amount: totalAmount.toFixed(2).toString(),
        currency: state?.currency,
        userId: "dummy-user-id", // Replace or fetch via Redux
        items: [
          {
            product: "handmade-small-bag",
            price: state?.price,
            quantity: 1,
          },
        ],
      });

      setDbOrderId(response.data?.dbOrderId);
      return response.data?.paypalOrderId;
    } catch (error) {
      console.error("PayPal order creation failed", error);
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      const payer = details?.payer;
      const captureId =
        details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;

      const response = await axios.post(
        `${API_BASE}/paypal/${dbOrderId}/capture`,
        {
          captureId,
          payerId: data.payerID,
          emailAddress: payer?.email_address || "unknown@example.com",
          givenName: payer?.name?.given_name,
          surname: payer?.name?.surname,
          status: "COMPLETED",
          paidAt: new Date().toISOString(),
        }
      );

      setOrderDetails(response.data);
      navigate("/order-confirmed", {
        state: {
          orderDetails,
          totalAmount,
          shippingCost,
          paymentMethod,
          currency: state?.currency,
        },
      });
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderResponse = await createRazorPayOrder({
        totalAmount,
        userId: user._id,
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
          address: orderDetails.recipient.address,
        },
      });

      await initializeRazorpayPayment(
        orderResponse,
        (paymentResult) => {
          navigate("/order-confirmed", {
            state: {
              orderDetails,
              totalAmount,
              shippingCost,
              paymentMethod,
              paymentDetails: paymentResult.data,
              currency: state?.currency,
            },
          });
        },
        (error) => {
          console.error("Razorpay failed:", error);
          alert(error.message);
        }
      );
    } catch (error) {
      console.error("Razorpay setup error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 p-6 shadow-black bg-white rounded-lg shadow-lg">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {user.role === "admin" && (
          <>
            <h2 className="text-xl font-bold">Shipper Info</h2>
            <input{...register("shipper.name")} placeholder="Name" className="border p-2 w-full"
            />
            <input {...register("shipper.company")} placeholder="Company" className="border p-2 w-full"
            />
            <input  {...register("shipper.phone")} placeholder="Phone" className="border p-2 w-full"
            />
            <input  {...register("shipper.address.street")} placeholder="Street" className="border p-2 w-full"
            />
            <input {...register("shipper.address.city")} placeholder="City" className="border p-2 w-full"
            />
            <input {...register("shipper.address.state")} placeholder="State" className="border p-2 w-full"
            />
            <input {...register("shipper.address.postalCode")} placeholder="Postal Code" className="border p-2 w-full"
            />
            <input {...register("shipper.address.countryCode")} placeholder="Country Codem" className="border p-2 w-full" />
          </>)}

        {/*💁‍♂️Recipients info*/}
        <h2 className="text-xl font-bold">Recipient Info</h2>
        <input {...register("recipient.name", { required: true })} placeholder="Name" className="border p-2 w-full" />

        <input {...register("recipient.company")} placeholder="Company" className="border p-2 w-full" />

        {/* <input {...register("recipient.phone", { required: true })} placeholder="Phone" className="border p-2 w-full" /> */}

        <CountryStateSelector
          onChange={({ country, state }) => {
            setValue("recipient.address.countryCode", country?.value || "");
            setValue("recipient.address.state", state?.name || "");
            setValue("recipient.address.stateCode" ,state?.value || "")
            setValue("recipient.address.dialCode", country?.dialCode || ""); // Set dial code
          }}
        />



        <input
          type="hidden"
          {...register("recipient.address.countryCode")}
        />
        <input
          type="hidden"
          {...register("recipient.address.state")}
        />
        <input
          type="hidden"
          {...register("recipient.address.stateCode")}
        />

        <div className="mt-4">  {/* mobile number selector */}
          <label className="block mb-1">Phone Number</label>
          <div className="flex items-center gap-2">
            <span className="border px-3 py-2 bg-gray-100 rounded text-sm">
              +{watch("recipient.address.dialCode") || "__"}
            </span>
            <input
              type="tel"
              {...register("recipient.address.phone", { required: "Phone is required" })}
              className="border p-2 flex-1 rounded w-full"
              placeholder="Enter phone number"
            />
          </div>
          {errors?.recipient?.address?.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.recipient.address.phone.message}</p>
          )}
        </div>

        {/* <input {...register("recipient.address.countryCode", { required: true })} placeholder="Country Code" className="border p-2 w-full" /> */}

        {/* <input {...register("recipient.address.state", { required: true })} placeholder="State" className="border p-2 w-full" /> */}

        <input {...register("recipient.address.city", { required: true })} placeholder="City" className="border p-2 w-full" />

        <input {...register("recipient.address.street", { required: true })} placeholder="Street" className="border p-2 w-full" />

        <input {...register("recipient.address.postalCode", { required: true })} placeholder="Postal Code" className="border p-2 w-full" />


        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("recipient.address.residential")} />
          Residential
        </label>

        <h2 className="text-xl font-bold">Payment</h2>
        <select {...register("paymentMethod", { required: true })} className="border p-2 w-full">
          <option value="">Choose payment</option>

          {state?.currency === "INR" && <option value="RazorPay">RazorPay</option>}
          {state?.currency !== "INR" && <option value="PayPal">PayPal</option>}

          <option value="CashOnDelivery">Cash on Delivery</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>

        {showPaymentButton && (
          <div className="mt-4">
            <p>Product Price: {state?.price?.toFixed(2)} {state?.currency}</p>
            <p>Shipping Cost: {shippingCost?.toFixed(2)} {state?.currency}</p>
            <p className="font-bold">Total Amount: {totalAmount?.toFixed(2)} {state?.currency}</p>

            {paymentMethod === "PayPal" && (
              <PayPalScriptProvider
                options={{
                  "client-id": import.meta.env.VITE_APP_PAYPAL_CLIENT_ID,
                  currency: state?.currency || "USD",
                  intent: "capture",
                }}
              >
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
              </PayPalScriptProvider>
            )}

            {paymentMethod === "RazorPay" && (
              <button
                type="button"
                onClick={handleRazorpayPayment}
                className="w-full py-2 bg-blue-800 text-white text-lg rounded mt-2"
              >
                Pay {totalAmount?.toFixed(2)} {state?.currency} with Razorpay
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
