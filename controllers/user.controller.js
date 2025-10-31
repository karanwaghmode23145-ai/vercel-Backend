import express from 'express';
import User from "../models/user.model.js";

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, mobile } = req.body;

    // ✅ simple validation
    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // ✅ check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email or Mobile already exists" });
    }

    // ✅ create user
    const newUser = new User({ fullName, email, password, mobile });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: newUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });

        
    }
};

//login user 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        // Check user existence
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        // Check password
        if (user.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        // Successful login
        res.status(200).json({ success: true, message: "Login successful", data: user });       
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
        
        
    }
};

//get User Profile add

export const getUserProfile = async (req, res) => {
 try {

  console.log("👉 GET /api/user/profile called");
   console.log("Query received:", req.query);

   const { email } = req.query; // frontend se email query me bhejna hoga

   if (!email) {
      console.log("❌ Email missing");
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    console.log("🟢 User found:", user);

     if (!user) {
      console.log("❌ No user found in DB");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
 
 } catch (error) {
   console.error("🔥 Server Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
 }
};






// ✅ Update user profile
export const updateUserProfile = async (req, res) => {
  try {

    console.log("👉 PUT /api/user/profile called");
    console.log("Request body:", req.body);

    const { email, fullName, mobile } = req.body;

    if (!email) {
      console.log("❌ Email missing in request");
      return res.status(400).json({
        success: false,
        message: "Email is required to update profile",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { fullName, mobile },
      { new: true }
    );
    
     if (!updatedUser) {
      console.log("❌ User not found for email:", email);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User updated successfully:", updatedUser);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("💥 Server error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};