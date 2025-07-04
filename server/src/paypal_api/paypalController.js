// paypal_api/controllers/paypalController.js
import Order from "../models/Order.js";
import axios from "axios";

export const capturePayPalPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const {
      captureId,
      payerId,
      emailAddress,
      status,
      paidAt
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.payment = {
      ...order.payment,
      status,
      captureId,
      payerId,
      emailAddress,
      paidAt: paidAt || new Date(),
    };

    if (status === "COMPLETED") {
      order.status = "Paid";
    }

    await order.save();
    res.status(200).json({ success: true, message: "Payment captured", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPayPalOrder = async (req, res) => {
  try {
    // validate amount 
    const amountValue = parseFloat(req.body.amount);
    if( isNaN(amountValue) ){
      return res.status(400).json({
        success: false,
        message: "Invalid amount format"
      });
    }
    if (amountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }
    
    const accessToken = await getPayPalAccessToken();

    const order = await axios.post(
      `${process.env.PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amountValue.toFixed(2),
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Save the Order in MongoDB
    const newOrder = await Order.create({
      user: req.body.userId,
      items: req.body.items,
      payment: {
        method: "PayPal",
        status: "Pending"
      },
      totalAmount: req.body.amount,
      status: "Pending"
    });

    res.status(201).json({
      paypalOrderId: order.data.id,
      dbOrderId: newOrder._id
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getPayPalAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");

  const res = await axios.post(
    `${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
};


