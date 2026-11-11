import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  getUserById,
  getAllUsers,
  deleteUser,
  getUserByEmail,
} from "../controllers/userController.js";

import { authUser, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Logged-in user routes
router.get("/profile", authUser, getMyProfile);

router.put("/profile", authUser, updateMyProfile);

// Admin routes
router.get("/", authUser, adminOnly, getAllUsers);

router.get("/:id", authUser, adminOnly, getUserById);

router.get("/email", authUser, adminOnly, getUserByEmail);

router.delete("/:id", authUser, adminOnly, deleteUser);

export default router;
