import Product from "../models/product.model.js";

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "Success", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;
    const newProduct = new Product({ name, price, description, category, image });
    await newProduct.save();
    res.status(201).json({ message: "Success", data: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Product By ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Success", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Related Products by Category
export const getRelatedProducts = async (req, res) => {
  try {
    const { category, id } = req.params; // category and current product id
    const relatedProducts = await Product.find({
      category,          // same category
      _id: { $ne: id },  // exclude current product
    }).limit(4);         // limit to 4 products

    res.status(200).json({ message: "Success", data: relatedProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, rating, comment } = req.body;

    if (!user || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Push a new review
    product.reviews.push({
      user,
      rating: Number(rating),
      comment,
    });

    // ✅ Update average rating
    const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.reviewsCount = product.reviews.length;
    product.rating = total / product.reviewsCount;

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error adding review:", error.message);
    res.status(500).json({ message: error.message });
  }
};
