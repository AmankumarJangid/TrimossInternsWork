// import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { PAYPAL_CLIENT_ID, API_BASE } from '../../config';




export const api = axios.create({
  baseURL: API_BASE || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function AddressForm({productPrice}) {
  const {
    register,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    formState: { errors }
  } = useForm();

  const [shippingCost, setShippingCost] = useState(0);
  const [totalAmount, setTotalAmount] = useState(productPrice);
  // eslint-disable-next-line no-unused-vars
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPayPalButton, setShowPayPalButton] = useState(false);

  


  const onSubmit = async (data) => {
    try {
      const payload = {
        origin: {
          streetLines: [data.shipper.address.street || "Ratanada Road"],
          city: data.shipper.address.city || "Jodhpur",
          state: data.shipper.address.state || "RJ",
          postalCode: data.shipper.address.postalCode || "342011",
          countryCode: data.shipper.address.countryCode || "IN",
          residential: false
        },
        destination: {
          streetLines: [data.recipient.address.street || "456 Queen St"],
          city: data.recipient.address.city || "Toronto",
          state: data.recipient.address.state || "ON",
          postalCode: data.recipient.address.postalCode || "M5H 2N2",
          countryCode: data.recipient.address.countryCode || "CA",
          residential: data.recipient.address.residential
        },
        packages: [
          {
            weight: {
              units: "KG",
              value: 0.4
            },
            dimensions: {
              length: 4,
              width: 3,
              height: 2,
              units: "IN"
            }
          }
        ],
        serviceType: "INTERNATIONAL_PRIORITY"  // Optional
      };

      const res = await api.post(`/fedex/rates`, payload);
      console.log(res.data);

      // how can I use this price to send over to the paypal where it also access base price of the product 
      const totalNetCharge = res.data?.data?.output?.rateReplyDetails[0]?.ratedShipmentDetails[0]?.totalNetCharge;

      const shippingCostValue = parseFloat(totalNetCharge || 0);
      setShippingCost(shippingCostValue);
      setTotalAmount(productPrice + shippingCostValue);
      setOrderDetails(data);
      setShowPayPalButton(true);

      console.log(totalNetCharge , totalAmount);
      alert('Submitted!');
    } catch (err) {
      console.error(err);
      alert('Failed!');
    }
  };

/// 🚩 here it handles the creation of orderes for the 
  const createOrder = async () =>{
    try{
      // const response = await axios.post(`${API_BASE}/paypal/create-order` , {
      //   amount : totalAmount.toFixed(2),
      //   userId : "user-id-here",
      //   items  : [
      //     {
      //       product : "product-id-here",
      //       price : productPrice,
      //       quantity : 1
      //     }
      //   ]

      // });

      const response = await api.post(`/paypal/create-order` , {
        amount : totalAmount,
        // description : "This is amount for the product"
      });

      return response.data?.paypalOrderId;
    }
    catch(error){
      console.error("Error creating Paypal order ", error);
      throw error;
    }
  }


  /// 🚜👍 Here it handles the when the payment is approved from the 
  // eslint-disable-next-line no-unused-vars
  const onApprove = async (data , actions) => {
    try{
      const response = await axios.post(`${API_BASE}/paypal/${data.orderID}/capture`, {
        captureId : data.captureId,
        payerId  : data.payerID,
        emailAddress  : data.payer.email_address,
        status : "COMPLETED",
        paidAt : new Date().toISOString()
      });

      setOrderDetails(response.data);
      alert("Payment Successful");
      console.log( "Order Completed" , response.data);
    }
    catch (error){
      console.error("Error capturing payment:", error);
      alert("Payment failed!");
    }
  }

  return (
    <div className='max-w-3xl mx-auto mt-10 mb-10 p-6 shadow-black bg-white rounded-lg shadow-lg '>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Shipper Info</h2>
        <input {...register("shipper.name")} placeholder="Name" className="border p-2 w-full" />
        <input {...register("shipper.company")} placeholder="Company" className="border p-2 w-full" />
        <input {...register("shipper.phone")} placeholder="Phone" className="border p-2 w-full" />
        <input {...register("shipper.address.street")} placeholder="Street" className="border p-2 w-full" />
        <input {...register("shipper.address.city")} placeholder="City" className="border p-2 w-full" />
        <input {...register("shipper.address.state")} placeholder="State" className="border p-2 w-full" />
        <input {...register("shipper.address.postalCode")} placeholder="Postal Code" className="border p-2 w-full" />
        <input {...register("shipper.address.countryCode")} placeholder="Country Code" className="border p-2 w-full" />

        <h2 className="text-xl font-bold">Recipient Info</h2>
        <input {...register("recipient.name")} placeholder="Name" className="border p-2 w-full" />
        <input {...register("recipient.company")} placeholder="Company" className="border p-2 w-full" />
        <input {...register("recipient.phone")} placeholder="Phone" className="border p-2 w-full" />
        <input {...register("recipient.address.street")} placeholder="Street" className="border p-2 w-full" />
        <input {...register("recipient.address.city")} placeholder="City" className="border p-2 w-full" />
        <input {...register("recipient.address.state")} placeholder="State" className="border p-2 w-full" />
        <input {...register("recipient.address.postalCode")} placeholder="Postal Code" className="border p-2 w-full" />
        <input {...register("recipient.address.countryCode")} placeholder="Country Code" className="border p-2 w-full" />
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("recipient.address.residential")} />
          Residential
        </label>

        <h2 className="text-xl font-bold">Payment</h2>
        <select {...register("paymentMethod")} className="border p-2 w-full">
          <option value="">Choose payment</option>
          <option value="Card">Card</option>
          <option value="PayPal">PayPal</option>
          <option value="UPI">UPI</option>
          <option value="CashOnDelivery">Cash on Delivery</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>

        {
          //paypal button shown after submittion
          showPayPalButton && (
          <div className="mt-4">
            <div className="mb-4">
              <p>Product Price: ${productPrice.toFixed(2)}</p>
              <p>Shipping Cost: ${shippingCost.toFixed(2)}</p>
              <p className="font-bold">Total Amount: ${totalAmount.toFixed(2)}</p>
            </div>
            
            <PayPalButtons  
              style={{ layout: "vertical" }}
              createOrder={createOrder}
              onApprove={onApprove}
            />
          </div>
        )
        }
      </form>
    </div>

  );
}