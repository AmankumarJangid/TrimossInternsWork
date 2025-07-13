import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function OrderConfirmed() {
  const { state } = useLocation();
  const navigate = useNavigate();
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

  // Destructure order details or provide defaults
  const orderDetails = state?.orderDetails;
  const shippingCost = state?.shippingCost || 0;
  const totalAmount = state?.totalAmount || 0;

  const recipient = orderDetails?.recipient;
  const shipper = orderDetails?.shipper;
  const orderDate = new Date().toLocaleDateString();

  if (!state) {
    return (
      <div className="bg-white py-16 text-center">
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
    <div className="bg-amber-50">
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-2xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
            Thanks for your order!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
            Your order has been successfully placed and will be processed within
            24 hours during working days. We will notify you by email once it
            has been shipped.
          </p>

          <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Date
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {orderDate}
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Payment Method
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                PayPal
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Name
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {recipient?.name || "N/A"}
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Shipping Address
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {recipient?.address?.street}, {recipient?.address?.city},{" "}
                {recipient?.address?.state}, {recipient?.address?.postalCode},{" "}
                {recipient?.address?.countryCode}
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Phone
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {recipient?.phone || "N/A"}
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Shipping Cost
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                ${shippingCost.toFixed(2)}
              </dd>
            </dl>
            <dl className="sm:flex items-center justify-between gap-4">
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                Total Paid
              </dt>
              <dd className="font-medium text-green-700 dark:text-green-400 sm:text-end">
                ${totalAmount.toFixed(2)}
              </dd>
            </dl>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5">
              Track your order
            </button>
            <button
              onClick={() => navigate("/")}
              className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-600 focus:outline-none"
            >
              Return to shopping
            </button>
            <button
              onClick={downloadInvoice}
              className="py-2.5 px-5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              Download Invoice
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
