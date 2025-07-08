// paypal_api/routes/paypalRoutes.js
import express from "express";
import { capturePayPalPayment, createPayPalOrder } from "../paypal_api/paypalController.js";

const router = express.Router();

router.post("/:orderId/capture", capturePayPalPayment);
router.post("/create-order", createPayPalOrder);

export default router;


// server/index.js or where you load all routes
// import paypalRoutes from "../paypal_api/routes/paypalRoutes.js";
// app.use("/api/paypal", paypalRoutes);
