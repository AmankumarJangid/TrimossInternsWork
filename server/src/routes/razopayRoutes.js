// paypal_api/routes/paypalRoutes.js
import express from "express";
import { createRazorPayOrder, captureRazorPayPayment } from "../razorpay_api/razorpayController.js";

const router = express.Router();

router.post("/create-order", createRazorPayOrder);
router.post("/:orderId/capture", captureRazorPayPayment);

export default router;
