import express from "express";
import { createOrder, getAllOrders, getOrderById, confirmFedexShipment } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/:orderId/confirm-shipment", confirmFedexShipment);

export default router;

// server/index.js or wherever routes are loaded
// import orderRoutes from "./routes/orderRoutes.js";
// app.use("/api/orders", orderRoutes);
