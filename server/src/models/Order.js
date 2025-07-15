import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    // type: mongoose.Schema.Types.ObjectId,
    type:'String',
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Product",
        type : String,
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  payment: {
    method: { type: String, enum: ["PayPal", "Razorpay"], required: true },
    status: { type: String },
    captureId: String,  // Will store razorpayOrderId or paypalCaptureId
    payerId: String,    // Will store razorpayPaymentId or paypalPayerId
    emailAddress: String,
    paidAt: Date,
  },
  shipping: {
    name: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
  },
  fedex: {
    rateRequestId: String,
    rate: String,
    currency: String,
    serviceType: String,
    shipmentId: String,
    trackingNumber: String,
    labelUrl: String,
    finalRate: String,
    shipmentConfirmed: { type: Boolean, default: false },
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
