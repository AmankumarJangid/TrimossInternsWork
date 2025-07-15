import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import crypto from 'crypto';

// Initialize Razorpay with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Creates a new Razorpay order and stores it in the database
 */
export const createRazorPayOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = 'USD',
      userId,
      products,
      shipping
    } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Amount is already in smallest currency unit from frontend
    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency,
      receipt: `order_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    });

    // Create order in database with amount in dollars/rupees
    const order = new Order({
      user: userId,
      products,
      shipping,
      totalAmount: amount / 100, // Convert back to dollars/rupees for storage
      payment: {
        method: 'Razorpay',
        status: 'Pending',
        captureId: razorpayOrder.id
      }
    });

    await order.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create Razorpay Order Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating Razorpay order'
    });
  }
};

/**
 * Captures and verifies Razorpay payment
 */
export const captureRazorPayPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Verify payment status with Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment not captured'
      });
    }

    // Update order with payment details
    order.payment.status = 'Completed';
    order.payment.payerId = razorpay_payment_id;
    order.payment.paidAt = new Date();
    order.status = 'Paid';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        orderId: order._id,
        paymentId: razorpay_payment_id,
        amount: payment.amount / 100, // Convert from paise to rupees or cents to Dollars
        status: payment.status
      }
    });
  } catch (error) {
    console.error('Capture Razorpay Payment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error capturing payment'
    });
  }
};
