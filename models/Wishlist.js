import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true }, // user identify karne ke liye
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);
