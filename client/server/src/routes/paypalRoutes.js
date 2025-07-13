// paypal_api/routes/paypalRoutes.js
import express from "express";
import { createPayPalOrder, capturePayPalPayment } from "../paypal_api/paypalController.js";

const router = express.Router();

router.post("/create-order", createPayPalOrder);
router.post("/:orderId/capture", capturePayPalPayment);

export default router;
