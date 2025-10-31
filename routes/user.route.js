import express from "express";
import { registerUser, getAllUsers, loginUser , getUserProfile,
  updateUserProfile, } from "../controllers/user.controller.js";


const router = express.Router();

// User Registration Route
router.post("/register", registerUser);

// Get all users Route
router.get("/", getAllUsers);

// Login user Route
router.post("/login", loginUser);


// ✅ Get Single User Profile
router.get("/profile", getUserProfile);

// ✅ Update Profile
router.put("/profile", updateUserProfile);


export default router;
