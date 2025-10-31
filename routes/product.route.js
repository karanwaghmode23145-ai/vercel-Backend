import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  getRelatedProducts,
  addReview, // ✅ add this
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);
router.get("/related/:category/:id", getRelatedProducts);

// ✅ Add Review route
router.post("/:id/review", addReview);

export default router;