import express from 'express';
import User from "../models/user.model.js";

//user regisration simple way
//regisration page he bs  
export const registerUser = async (req, res) => {
    console.log("🟢 registerUser function called");

    try {
        const { fullName, email, password, mobile } = req.body;
        console.log("📩 Request Body:", { fullName, email, mobile });

        // ✅ simple validation
        if (!fullName || !email || !password || !mobile) {
            console.log("❌ Validation failed — Missing required fields");
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // ✅ check existing user
        console.log("🔍 Checking if user already exists (email or mobile)...");
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

        if (existingUser) {
            console.log("⚠️ User already exists:", existingUser.email || existingUser.mobile);
            return res.status(400).json({ success: false, message: "Email or Mobile already exists" });
        }

        // ✅ create user
        console.log("🆕 Creating new user document...");
        const newUser = new User({ fullName, email, password, mobile });
        await newUser.save();
        console.log("✅ User saved successfully:", newUser._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: newUser,
        });

    } catch (error) {
        console.error("🔥 Error in registerUser:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// get all users
// regisration pages ka data laya bs 
export const getAllUsers = async (req, res) => {
    console.log("🟢 getAllUsers function called");
    try {
        console.log("🔍 Fetching all users from database...");

        const users = await User.find();
        console.log(`✅ ${users.length} user(s) found.`);

        res.status(200).json({ success: true, data: users });
        console.log("📤 Response sent successfully!");


    } catch (error) {
        console.error("🔥 Error in getAllUsers:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });

    }
}

//login page route create 

export const loginUser = async (req, res) => {
    console.log("🟢 loginUser function called");

    try {
        const { email, password } = req.body;
        console.log("📩 Request body received:", req.body);

        // ✅ Validate input
        if (!email || !password) {
            console.log("❌ Missing email or password");
            return res
                .status(400)
                .json({ success: false, message: "Email and password are required" });
        }

        console.log("✅ Validation passed. Proceeding to check user...");

         // 🧩 Find user by email (example)

         const user = await User.findOne({ email });
        console.log("🔎 User found:", user);

        if (!user) {
            console.log("⚠️ No user found with this email");
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

         // Check password
        console.log("🔐 Comparing provided password with stored password...");
        if (user.password !== password) {
            console.log("❌ Passwords do not match");
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

         // Successful login
        console.log("✅ Login successful for user:", user.email);
        res.status(200).json({ success: true, message: "Login successful", data: user }); 


    } catch (error) {
         console.error("🔥 Error in loginUser:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });

    }


}