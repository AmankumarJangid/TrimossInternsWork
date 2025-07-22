// server/controllers/orderController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import fedexService from "../fedexApi/services/fedexService.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      products,
      payment,
      shipping,
      fedex
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // To avoid N+1 queries, fetch all products at once
    const productIds = products.map(p => p.product);
    const foundProducts = await Product.find({ '_id': { $in: productIds } });
    const productMap = new Map(foundProducts.map(p => [p._id.toString(), p]));

    let totalAmount = 0;
    const orderProducts = await Promise.all(products.map(async (item) => {
      const product = productMap.get(item.product);
      if (!product) throw new Error(`Product with ID ${item.product} not found`);
      const itemTotal = product.pricing.basePrice * item.quantity;
      totalAmount += itemTotal;
      return {
        product: product._id,
        quantity: item.quantity,
        price: product.pricing.basePrice,
      };
    }));

    const newOrder = new Order({
      user: userId,
      products: orderProducts,
      totalAmount,
      payment,
      shipping,
      fedex,
      status: payment.status === "COMPLETED" ? "Paid" : "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmFedexShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.fedex.shipmentConfirmed) {
      return res.status(400).json({ message: "Shipment already confirmed" });
    }

    const shipmentData = {
      shipper: {
        name: "Warehouse Admin",
        phone: "0000000000",
        company: "Your Company",
        address: {
          streetLines: ["Your warehouse address"],
          city: "Jodhpur",
          state: "RJ",
          postalCode: "342001",
          countryCode: "IN",
        },
      },
      recipient: {
        name: order.shipping.name,
        phone: order.shipping.phone,
        company: "Customer",
        address: {
          streetLines: [order.shipping.address.street],
          city: order.shipping.address.city,
          state: order.shipping.address.state,
          postalCode: order.shipping.address.postalCode,
          countryCode: order.shipping.address.country,
          residential: true,
        },
      },
      serviceType: order.fedex.serviceType,
      customsValue: {
        currency: order.fedex.currency || "INR",
        amount: Number(order.fedex.rate || 100),
      },
      commodities: [
        {
          description: "Merchandise",
          countryOfManufacture: "IN",
          quantity: 1,
          unitPrice: { currency: order.fedex.currency || "INR", amount: Number(order.fedex.rate || 100) },
          customsValue: { currency: order.fedex.currency || "INR", amount: Number(order.fedex.rate || 100) },
          weight: 1,
        },
      ],
      packages: [
        {
          weight: 1,
          dimensions: { length: 10, width: 10, height: 10 },
        },
      ],
    };

    const shipment = await fedexService.createShipment(shipmentData);

    order.fedex.shipmentId = shipment.masterTrackingNumber;
    order.fedex.trackingNumber = shipment.masterTrackingNumber;
    order.fedex.labelUrl = shipment.completedShipmentDetail?.completedPackageDetails?.[0]?.label?.url || "";
    order.fedex.finalRate = shipment.shipmentAdvisoryDetails?.[0]?.netCharge?.amount || order.fedex.rate;
    order.fedex.shipmentConfirmed = true;

    await order.save();
    res.status(200).json({ success: true, data: order.fedex });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "title price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "title price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
