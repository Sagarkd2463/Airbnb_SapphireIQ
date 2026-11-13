import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Listing from "../models/Listing.js";
import {
  validateComment,
  validateId,
  validateRating,
} from "../utils/helper.js";

// Create a review
export const createReviewService = async ({
  bookingId,
  userId,
  rating,
  comment,
}) => {
  validateId(bookingId);
  validateComment(comment);
  validateRating(rating);

  // Find booking
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return {
      status: 404,
      message: "Booking not found",
    };
  }

  // Check booking ownership
  if (booking.guest.toString() !== userId.toString()) {
    return {
      status: 403,
      message: "You can only review your own bookings",
    };
  }

  // Check cancelled booking
  if (booking.status === "cancelled") {
    return {
      status: 400,
      message: "Cannot review a cancelled booking",
    };
  }

  // Check whether the stay is completed
  if (booking.checkOut > new Date()) {
    return {
      status: 400,
      message: "You can review only after completing your stay",
    };
  }

  // Check whether listing still exists
  const listing = await Listing.findById(booking.listing);

  if (!listing) {
    return {
      status: 404,
      message: "Listing not found",
    };
  }

  // Create review
  try {
    const review = await Review.create({
      listing: booking.listing,
      guest: userId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    return {
      status: 201,
      message: "Review submitted successfully",
      data: review,
    };
  } catch (error) {
    // Handle duplicate review
    if (error.code === 11000) {
      return {
        status: 409,
        message: "You have already reviewed this property",
      };
    }

    throw error;
  }
};

// Get reviews for a listing
export const getListingReviewsService = async (listingId) => {
  // Validate listing ID
  validateId(listingId);

  // Check listing existence
  const listing = await Listing.findById(listingId).select("_id");

  if (!listing) {
    return {
      status: 404,
      message: "Listing not found",
    };
  }

  // Get reviews
  const reviews = await Review.find({
    listing: listingId,
  })
    .populate("guest", "name avatarUrl")
    .sort({ createdAt: -1 });

  return {
    status: 200,
    message: "Reviews fetched successfully",
    data: reviews,
  };
};
