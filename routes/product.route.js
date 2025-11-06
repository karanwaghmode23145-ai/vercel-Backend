import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  getRelatedProducts,
  addProductReview,
  
} from "../controllers/product.controller.js";

const router = express.Router();


// products view
router.get("/", getAllProducts);

//porduct create krto
router.post("/", createProduct);

//product by id
router.get("/:id", getProductById);

// 🟢 Get Related Products by Category
router.get("/related/:category/:id", getRelatedProducts);

// 🆕 Review route
router.post("/:id/review", addProductReview);


export default router;