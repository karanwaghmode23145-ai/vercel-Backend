import mongoose from "mongoose";

// Review schema
const reviewSchema = new mongoose.Schema({
  user: { type: String, required: false }, // 🔹 Optional (no login yet)
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  reviews: { type: [reviewSchema], default: [] },
})

const Product = mongoose.model("Product", productSchema);
export default Product;
