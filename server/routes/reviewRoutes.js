import express from "express";

import { authenticateUser } from "../middleware/authMiddleware.js";

import {
  createReview,
  getListingReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// Get all reviews for a listing
router.get("/listing/:listingId", getListingReviews);

// Create review (authenticated guest)
router.post("/", authenticateUser, createReview);

export default router;
