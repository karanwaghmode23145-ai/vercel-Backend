import express from "express";
import Order from "../models/order.model.js";

const router = express.Router();

/* 🟢 GET all orders */
// router.get("/", async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("items.productId")
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (error) {
//     console.error("❌ Error fetching orders:", error);
//     res.status(500).json({ error: error.message });
//   }
// });


/* 🟢 Get orders of specific user */
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    console.log("👉 GET /api/orders called for:", email);

    if (!email) {
      console.log("❌ Email not provided in query.");
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const orders = await Order.find({ userEmail: email })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    console.log(`📦 Total Orders Found: ${orders.length}`);

    if (!orders.length) {
      console.log(`⚠️ No orders found for user: ${email}`);
      return res.json({
        success: true,
        message: "No orders found for this user",
        data: [],
      });
    }

    // 🔍 Console log each order with details
    orders.forEach((order, index) => {
      console.log(`\n🧾 Order #${index + 1}:`);
      console.log(`🆔 Order ID: ${order._id}`);
      console.log(`📧 User Email: ${order.userEmail}`);
      console.log(`💰 Total Amount: ${order.totalAmount}`);
      console.log(`📅 Date: ${order.createdAt}`);
      console.log("🛍️ Items:");
      order.items.forEach((item) => {
        console.log(
          `   → ${item.productId?.name || "Unknown Product"} x${item.qty}`
        ); // ✅ fixed here
      });
      console.log("----------------------------------");
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


/* 🟢 PLACE NEW ORDER */
router.post("/", async (req, res) => {
  try {
    console.log("🧾 Place Order API called");
    const { userEmail, items, totalAmount } = req.body;

    if (!userEmail) {
      console.log("❌ Missing userEmail in order body");
      return res
        .status(400)
        .json({ success: false, message: "userEmail is required" });
    }

    const newOrder = new Order({
      userEmail,
      items,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    console.log("✅ Order placed successfully:", savedOrder);
    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



/* 🟢 UPDATE order status */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // expecting "Completed" or "Pending"

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.productId");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;