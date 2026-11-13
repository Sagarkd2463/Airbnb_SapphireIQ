import express from "express";

import { authenticateUser } from "../middleware/authMiddleware.js";

import {
  checkAvailability,
  createBooking,
  getMyBookings,
  getHostBookings,
  cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// Public: Check property availability
router.get("/availability/:listingId", checkAvailability);

// All routes below require authentication
router.use(authenticateUser);

// Guest routes
router.post("/", createBooking);

router.get("/my-bookings", getMyBookings);

router.patch("/:id/cancel", cancelBooking);

// Host routes
router.get("/host", getHostBookings);

export default router;
