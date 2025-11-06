import express from "express";
import Wishlist from "../models/Wishlist.js";


const router = express.Router();

// 🟢 ADD product to wishlist
router.post("/", async (req, res) => {
 try {

    console.log("=== POST /api/wishlist called ===");
    console.log("1) req.body:", req.body);

    const { userEmail, productId } = req.body;

    if (!userEmail || !productId) {
      console.log("❌ userEmail or productId missing");
      return res.status(400).json({ error: "userEmail and productId required" });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userEmail, productId });
    console.log("2) existing:", existing);

    if (existing) {
      console.log("❌ Already in wishlist");
      return res.status(400).json({ error: "Already in wishlist" });
    }

    // Create new wishlist item
    const newItem = await Wishlist.create({ userEmail, productId });
    console.log("✅ Added to wishlist:", newItem);

    res.status(201).json(newItem);



 } catch (error) {
    console.error("ERR in POST /api/wishlist:", error);
    res.status(500).json({ error: error.message });
 }
});

// 🟢 GET wishlist items for a user
router.get("/:userEmail", async (req, res) => {
  try {
    console.log("=== GET /api/wishlist/:userEmail called ===");
    const { userEmail } = req.params;
    console.log("1) userEmail:", userEmail);

    if (!userEmail) {
      console.log("❌ userEmail missing in params");
      return res.status(400).json({ error: "userEmail is required" });
    }

    // Fetch wishlist items
    const items = await Wishlist.find({ userEmail }).populate("productId");
    console.log("✅ Wishlist items found:", items.length, items);

    res.status(200).json({ data: items });
  } catch (error) {
    console.error("ERR in GET /api/wishlist/:userEmail:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;