import express from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const router = express.Router();



/* ADD to cart */
// 🟢 POST /api/cart
router.post("/", async (req, res) => {
  try {

    console.log("=== 🛒 POST /api/cart called ===");
    
     console.log("1) req.body:", req.body);

     const { productId, qty } = req.body;

     if (!productId) {
      console.log("❌ productId missing");
      return res.status(400).json({ error: "productId is required" });
    }

    const wantedQty = typeof qty === "number" ? qty : Number(qty) || 1;
    console.log("✅ wantedQty:", wantedQty);

     // 4️⃣ Product find karte hain
    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ Product not found");
      return res.status(404).json({ error: "Product not found" });
    }

    // 5️⃣ Check karte hain kya yeh product already cart me hai
    let existingItem = await Cart.findOne({ productId });
    console.log(
      "7) existingItem:",
      existingItem ? "FOUND" : "NOT FOUND",
      existingItem
    );

      if (existingItem) {
      existingItem.qty += wantedQty;
      await existingItem.save();
      console.log("🟡 Updated item:", existingItem);
      return res.json({
        message: "Cart updated successfully",
        item: existingItem,
      });
    }

    // 7️⃣ Agar nahi hai to naya item create karo
    const newItem = await Cart.create({ productId, qty: wantedQty });
    console.log("🟢 Created new cart item:", newItem);

      // 8️⃣ Response send karo
    return res
      .status(201)
      .json({ message: "Item added to cart", item: newItem });
    
  } catch (error) {

    console.error("❌ ERR in POST /api/cart:", error);
    return res.status(500).json({ error: error.message });
    
  }
});

/* GET all cart items */

router.get("/", async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("productId");
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




export default router;