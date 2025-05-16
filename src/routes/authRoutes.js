import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { updateProfile } from "../controllers/authController.js";

const router = express.Router();

// Update user profile
router.put("/update-profile", authenticate, updateProfile);

export default router;
