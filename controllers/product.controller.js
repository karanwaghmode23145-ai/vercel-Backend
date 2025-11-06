import Product from "../models/product.model.js";

// all product
export const getAllProducts = async (req, res) =>{
  try {

     console.log("⏳ Fetching all products from database...");
     const products = await Product.find();

     console.log("✅ Products fetched successfully. Total:", products.length);
    console.log("📦 Product List:", products);

    res.status(200).json({ message: "Success", data: products });
    console.log("📤 Response sent to client (200 OK)");

  } catch (error) {
    console.error("🚨 Error while fetching products:", error.message);
    res.status(500).json({ message: error.message });
  }
}


// Create Product post method data add kela aahe 
export const createProduct = async (req, res) => {
  console.log("🟢 createProduct function called");

  try {

    const { name, price, description, category, image } = req.body;
    console.log("📩 Request Body:", req.body);

    // 2️⃣ New Product object bana rahe hain (MongoDB document)
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image,
    });
    console.log("🆕 New Product Object Created:", newProduct);

    // 3️⃣ Product ko database me save kar rahe hain
    await newProduct.save();
    console.log("✅ Product saved successfully in database:", newProduct._id);

     res.status(201).json({ message: "Success", data: newProduct });
    console.log("📤 Response sent to client (201 Created)");
    
  } catch (error) {
    console.error("🚨 Error while creating product:", error.message);
    res.status(500).json({ message: error.message });
  }
 
};

// sgle product id 
// Get Product By ID
export const getProductById = async (req, res) => {
 console.log("🟢 getProductById function called");

 try {

  const { id } = req.params;
  console.log("🔍 Product ID received from request:", id);

  const product = await Product.findById(id);

  // 3️⃣ Agar product nahi mila to error response bhejna
    if (!product) {
      console.log("❌ Product not found for ID:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    // 4️⃣ Agar product mil gaya to data bhejna
    console.log("✅ Product found:", product);
    res.status(200).json({ message: "Success", data: product });
    console.log("📤 Response sent to client successfully");

  
 } catch (error) {

  console.error("🚨 Error while fetching product by ID:", error.message);
    res.status(500).json({ message: error.message });
  
 }

};


// Get Related Products by Category
export const getRelatedProducts = async (req, res) =>{
  try {
    const { category, id } = req.params;
    console.log("🟢 Category:", category);
    console.log("🟢 Current Product ID:", id);

    const relatedProducts = await Product.find({
      category,
      _id: { $ne: id },
    }).limit(6);

    console.log("✅ Related Products Found:", relatedProducts.length);
     res.status(200).json({ message: "Success", data: relatedProducts });
    
  } catch (error) {

    console.error("❌ Error fetching related products:", error.message);
    res.status(500).json({ message: error.message });
    
  }
}

// ➕ Add a new review

/* 🟢 Add Product Review */
export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params; // Product ID from URL
    const { name, rating, comment } = req.body; // Review data

    // 🧠 Step 1: Validate Input
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🧠 Step 2: Find Product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🧠 Step 3: Create Review Object
    const review = {
      user: name, // 🔹 Assign name as user (since no auth)
      rating: Number(rating),
      comment,
    };

    // 🧠 Step 4: Push Review into Product
    product.reviews.push(review);

    // 🧠 Step 5: Update Average Rating + Count
    product.reviewsCount = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    // 🧠 Step 6: Save Updated Product
    await product.save();

    console.log("✅ Review Added:", review);
    console.log("⭐ Updated Rating:", product.rating);

    // 🧠 Step 7: Return Success Response
    res.status(201).json({
      message: "Review added successfully",
      data: product.reviews,
      rating: product.rating,
    });
  } catch (error) {
    console.error("❌ Error in addProductReview:", error.message);
    res.status(500).json({ message: error.message });
  }
};