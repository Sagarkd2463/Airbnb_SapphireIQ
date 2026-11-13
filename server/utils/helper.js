import mongoose from "mongoose";
import Booking from "../models/Booking.js";

// Validate MongoDB ObjectId
export const validateId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw Error("Invalid ID");
  }
};

// Validate rating
export const validateRating = (rating) => {
  if (
    rating === undefined ||
    !Number.isInteger(Number(rating)) ||
    Number(rating) < 1 ||
    Number(rating) > 5
  ) {
    return {
      status: 400,
      message: "Rating must be an integer between 1 and 5",
    };
  }
};

// Validate comment
export const validateComment = (comment) => {
  if (
    typeof comment !== "string" ||
    !comment.trim() ||
    comment.trim().length > 1000
  ) {
    return {
      status: 400,
      message: "Comment is required and must not exceed 1000 characters",
    };
  }
};

// Parse YYYY-MM-DD safely using UTC
export const parseDate = (value, field) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw Error(`${field} must be in YYYY-MM-DD format`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw Error(`Invalid ${field}`);
  }

  return date;
};

// Validate booking dates
export const validateDates = (checkIn, checkOut) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (checkIn < today) {
    throw Error("Check-in cannot be in the past");
  }

  if (checkOut <= checkIn) {
    throw Error("Check-out must be after check-in");
  }

  return Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
};

// Check overlapping bookings
export const checkBookingConflict = async (
  listingId,
  checkIn,
  checkOut,
  session = null,
) => {
  const query = Booking.findOne({
    listing: listingId,
    status: "confirmed",
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });

  if (session) {
    query.session(session);
  }

  return await query;
};
