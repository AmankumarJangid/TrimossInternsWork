import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export const api = axios.create({
  baseURL: API_BASE || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay Order
export const createRazorPayOrder = async (data) => {
  try {
    // Convert amount to smallest currency unit (cents)
    const amountInSmallestUnit = Math.round(data.totalAmount * 100);
    
    const response = await api.post("/razorpay/create-order", {
      amount: amountInSmallestUnit,
      currency: data.currency||"INR",
      userId: data.userId,
      products: data.products,
      shipping: data.shipping
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create order");
    }

    return response.data;
  } catch (error) {
    console.error("RazorPay Order Error:", error.response?.data || error.message);
    throw new Error(
      `RazorPay Order Creation Error: ${error.response?.data?.message || error.message}`
    );
  }
};

// Initialize Razorpay Payment
export const initializeRazorpayPayment = async (orderData, onSuccess, onError) => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Razorpay SDK failed to load");
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.data.amount, // Amount from the server (already in smallest currency unit)
      currency: orderData.data.currency,
      name: "Your Store Name",
      description: "Purchase Payment",
      order_id: orderData.data.razorpayOrderId,
      handler: async function (response) {
        try {
          // Verify payment with backend
          const verificationResponse = await api.post(
            `/razorpay/${orderData.data.orderId}/capture`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verificationResponse.data.success) {
            onSuccess(verificationResponse.data);
          } else {
            onError(new Error(verificationResponse.data.message || "Payment verification failed"));
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
          onError(error);
        }
      },
      prefill: {
        name: orderData.shipping?.name || "",
        email: orderData.shipping?.email || "",
        contact: orderData.shipping?.phone || "",
      },
      theme: {
        color: "#3B82F6",
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal closed");
          onError(new Error("Payment cancelled by user"));
        }
      }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.on('payment.failed', function (response) {
      onError(new Error(response.error.description));
    });
    razorpayInstance.open();
  } catch (error) {
    onError(error);
  }
};


    