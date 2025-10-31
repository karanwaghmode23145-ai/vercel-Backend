import express from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const router = express.Router();



/* ADD to cart */
// 🟢 POST /api/cart
router.post("/", async (req, res) => {
  try {
    console.log("=== POST /api/cart called ===");
    console.log("1) req.body:", req.body);

    const { productId, qty } = req.body;

    if (!productId) {
      console.log("❌ productId missing");
      return res.status(400).json({ error: "productId is required" });
    }

    // 🧠 FIX HERE: Define wantedQty correctly
    const wantedQty = typeof qty === "number" ? qty : Number(qty) || 1;
    console.log("✅ wantedQty:", wantedQty);

    // 🧠 Step 1: find the product
    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ Product not found");
      return res.status(404).json({ error: "Product not found" });
    }

    // 🧠 Step 2: check if item already exists in the cart
    let existingItem = await Cart.findOne({ productId });
    console.log("7) existingItem:", existingItem ? "FOUND" : "NOT FOUND", existingItem);

    if (existingItem) {
      existingItem.qty += wantedQty;
      await existingItem.save();
      console.log("🟡 Updated item:", existingItem);
      return res.json(existingItem);
    }

    // 🧠 Step 3: create new cart item
    const newItem = await Cart.create({ productId, qty: wantedQty });
    console.log("🟢 Created new cart item:", newItem);

    return res.status(201).json(newItem);
  } catch (error) {
    console.error("ERR in POST /api/cart:", error);
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

/* UPDATE quantity */

router.put("/:id", async (req, res) => {

    try {

        console.log("=== PUT /api/cart/:id called ===");

    // 1) show incoming params & body
    console.log("1) req.params:", req.params);    // e.g. { id: '68ff92c9...' }
    console.log("2) req.body:", req.body);        // e.g. { qty: 3 }

     // 2) destructure and validate qty
    const { qty } = req.body;
    if (qty === undefined) {
      console.log("3) Missing qty in body -> returning 400");
      return res.status(400).json({ error: "qty is required" });
    }
    const newQty = Number(qty);
    if (Number.isNaN(newQty) || newQty < 0) {
      console.log("3) Invalid qty:", qty);
      return res.status(400).json({ error: "qty must be a non-negative number" });
    }
    console.log("3) interpreted newQty:", newQty);

    // 3) perform DB update (returns updated doc because { new: true })
    const id = req.params.id;
    console.log("4) updating Cart item id:", id);

    const updated = await Cart.findByIdAndUpdate(
      id,
      { qty: newQty },
      { new: true }
    ).populate("productId"); // populate product details for frontend

      // 4) handle not-found
    console.log("5) DB update result:", updated);
    if (!updated) {
      console.log("6) No cart item found with id -> returning 404");
      return res.status(404).json({ error: "Cart item not found" });
    }

    // 5) optional behavior: if qty === 0 remove item and return remaining cart
    if (newQty === 0) {
      console.log("7) newQty is 0 — removing item");
      await Cart.findByIdAndDelete(id);
      const remaining = await Cart.find().populate("productId");
      console.log("7) Remaining cart items after delete:", remaining);
      return res.json(remaining);
    }

    console.log("8) Returning updated cart item");
    return res.json(updated);
        
    } catch (error) {
        console.log("8) Returning updated cart item");
    return res.json(updated);
    }

    
});

/* DELETE item */
router.delete("/:id", async (req, res) => {
    try {
         console.log("🗑 DELETE request received for cart item ID:", req.params.id);

         // 1️⃣ Delete the cart item from MongoDB using the provided ID
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);
     // 2️⃣ Log the deleted item for debugging
    console.log("✅ Deleted item:", deletedItem);

     // 3️⃣ If no item found with that ID
    if (!deletedItem) {
      console.log("⚠️ Item not found in database");
      return res.status(404).json({ error: "Item not found" });
    }

     // 4️⃣ Fetch the updated cart after deletion
    const updatedCart = await Cart.find().populate("productId");
    console.log("🛒 Updated cart after deletion:", updatedCart);

    // 5️⃣ Send the updated cart back to frontend
    res.json(updatedCart);
        
    } catch (error) {
        console.error("❌ Error deleting cart item:", error.message);
    res.status(500).json({ error: error.message });
    }
});

// delete all cart items
router.delete("/", async (req, res) => {
  try {
    const deletedItems = await Cart.deleteMany({});
    res.json(deletedItems);
  } catch (error) {
    console.error("❌ Error deleting cart items:", error.message);
    res.status(500).json({ error: error.message });
  }
});


//place order

router.post("/place-order", async (req, res) => {
  try {
    console.log("🧾 Place Order API called");

    // 1️⃣ Fetch all cart items
    const cartItems = await Cart.find().populate("productId");
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2️⃣ Calculate total
    const totalAmount = cartItems.reduce((acc, item) => {
      const price = item.productId?.price || 0;
      return acc + price * item.qty;
    }, 0);

    // 3️⃣ Create new order
    const newOrder = await Order.create({
      items: cartItems.map((item) => ({
        productId: item.productId._id,
        qty: item.qty,
      })),
      totalAmount,
    });

    console.log("✅ Order created:", newOrder);

    // 4️⃣ Clear the cart
    await Cart.deleteMany({});
    console.log("🧹 Cart cleared after order");

    // 5️⃣ Return response
    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error.message);
    res.status(500).json({ error: error.message });
  }
});