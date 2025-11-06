import express from "express";
import {
    registerUser,
    getAllUsers,
    loginUser
} from "../controllers/user.controller.js";

const router = express.Router();

// ragister page for user Route
router.post("/register", registerUser);
router.get("/", getAllUsers);
// Login user Route
router.post("/login", loginUser);


export default router;
