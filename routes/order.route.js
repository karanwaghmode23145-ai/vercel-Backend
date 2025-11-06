import express from "express";
import Order from "../models/order.model.js";

const router = express.Router();

/* 🟢 GET all orders or specific user's orders */
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    console.log("👉 GET /api/orders called for:", email || "ALL USERS");

    let orders;

    if (email) {
      // If user email provided → show only that user's orders
      orders = await Order.find({ userEmail: email })
        .populate("items.productId")
        .sort({ createdAt: -1 });
    } else {
      // Otherwise → show ALL orders (for admin dashboard)
      orders = await Order.find()
        .populate("items.productId")
        .sort({ createdAt: -1 });
    }

    if (!orders.length) {
      console.log(`⚠️ No orders found ${email ? "for " + email : ""}`);
      return res.status(200).json({
        success: true,
        message: "No orders found",
        data: [],
      });
    }

    // 🔍 Console log each order
    orders.forEach((order, index) => {
      console.log(`\n🧾 Order #${index + 1}:`);
      console.log(`🆔 ${order._id}`);
      console.log(`📧 ${order.userEmail}`);
      console.log(`💰 ₹${order.totalAmount}`);
      console.log(`📅 ${order.createdAt}`);
      console.log(`📦 Status: ${order.status}`);
      console.log("----------------------------------");
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


/* 🟢 PLACE NEW ORDER */
router.post("/", async (req, res) => {
  try {
    console.log("🧾 Place Order API called");
    const { userEmail, items, totalAmount } = req.body;

    if (!userEmail) {
      console.log("❌ Missing userEmail in order body");
      return res.status(400).json({
        success: false,
        message: "userEmail is required",
      });
    }

    const newOrder = new Order({ userEmail, items, totalAmount });
    const savedOrder = await newOrder.save();

    console.log("✅ Order placed successfully:", savedOrder);
    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


/* 🟢 UPDATE order status */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.productId");

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


// ✅ Get all orders (for admin dashboard)
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
