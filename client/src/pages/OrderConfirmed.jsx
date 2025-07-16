import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function OrderConfirmed() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderDetails = state?.orderDetails;
  const shippingCost = state?.shippingCost || 0;
  const totalAmount = state?.totalAmount || 0;

  const recipient = orderDetails?.recipient;
  const orderDate = new Date().toLocaleDateString();

  const downloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order Date: ${orderDate}`, 14, 35);
    doc.text(`Recipient: ${recipient?.name}`, 14, 45);
    doc.text(
      `Address: ${recipient?.address?.street}, ${recipient?.address?.city}, ${recipient?.address?.state}, ${recipient?.address?.postalCode}, ${recipient?.address?.countryCode}`,
      14,
      55,
      { maxWidth: 180 }
    );
    doc.text(`Phone: ${recipient?.phone}`, 14, 65);
    doc.text(
      `Product Price: $${(totalAmount - shippingCost).toFixed(2)}`,
      14,
      80
    );
    doc.text(`Shipping Cost: $${shippingCost.toFixed(2)}`, 14, 90);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Paid: $${totalAmount.toFixed(2)}`, 14, 105);

    doc.save(`Invoice_${orderDate.replace(/\//g, "-")}.pdf`);
  };

  if (!state) {
    return (
      <div className="bg-white py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          No order found
        </h2>
        <p className="text-gray-500 mb-6">
          Please complete a purchase before visiting this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Go Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen px-4 md:px-6 lg:px-8">
      <section className="bg-white py-10 antialiased rounded-md shadow-sm max-w-3xl mx-auto mt-10">
        <div className="px-4 md:px-8">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl mb-2">
            Thanks for your order!
          </h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Your order has been successfully placed and will be processed within
            24 hours during working days. We will notify you by email once it
            has been shipped.
          </p>

          <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 mb-6">
            <dl className="flex flex-col sm:flex-row justify-between">
              <dt className="text-gray-500">Date</dt>
              <dd className="text-gray-900 font-medium">{orderDate}</dd>
            </dl>
            <dl className="flex flex-col sm:flex-row justify-between">
              <dt className="text-gray-500">Payment Method</dt>
              <dd className="text-gray-900 font-medium">PayPal</dd>
            </dl>
            <dl className="flex flex-col sm:flex-row justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="text-gray-900 font-medium">
                {recipient?.name || "N/A"}
              </dd>
            </dl>
            <dl className="flex flex-col sm:flex-row justify-between">
              <dt className="text-gray-500">Shipping Address</dt>
              <dd className="text-gray-900 font-medium">
                {recipient?.address?.street}, {recipient?.address?.city},{" "}
                {recipient?.address?.state}, {recipient?.address?.postalCode},{" "}
                {recipient?.address?.countryCode}
              </dd>
            </dl>
            <dl className="flex flex-col sm:flex-row justify-between">
              <dt className="text-gray-500">Phone</dt>
              <dd className="text-gray-900 font-medium">
                {recipient?.phone || "N/A"}
              </dd>
            </dl>
            <dl className="flex flex-col sm:flex-row justify-between">
              <dt className="text-gray-500">Shipping Cost</dt>
              <dd className="text-gray-900 font-medium">
                ${shippingCost.toFixed(2)}
              </dd>
            </dl>
            <dl className="flex flex-col sm:flex-row justify-between">
              <dt className="text-gray-500">Total Paid</dt>
              <dd className="text-green-700 font-semibold">
                ${totalAmount.toFixed(2)}
              </dd>
            </dl>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <button className="w-full sm:w-auto text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-lg text-sm font-medium">
              Track your order
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 hover:text-blue-600 px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              Return to shopping
            </button>
            <button
              onClick={downloadInvoice}
              className="w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-600 px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              Download Invoice
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
