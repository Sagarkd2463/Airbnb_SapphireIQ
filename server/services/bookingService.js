import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import {
  validateId,
  validateDates,
  parseDate,
  checkBookingConflict,
} from "../utils/helper.js";

// Check listing availability
export const checkAvailabilityService = async ({
  listingId,
  checkIn,
  checkOut,
}) => {
  validateId(listingId);

  const startDate = parseDate(checkIn, "check-in");
  const endDate = parseDate(checkOut, "check-out");

  validateDates(startDate, endDate);

  const listing = await Listing.findById(listingId);

  if (!listing || !listing.isAvailable) {
    throw Error("Listing not found or unavailable");
  }

  const conflict = await checkBookingConflict(listing._id, startDate, endDate);

  return {
    available: !conflict,
  };
};

// Create booking
export const createBookingService = async ({
  listingId,
  userId,
  checkIn,
  checkOut,
  guests,
}) => {
  validateId(listingId);
  validateId(userId);

  // Validate guests
  const guestCount = Number(guests);

  if (
    guests === undefined ||
    guests === null ||
    guests === "" ||
    !Number.isInteger(guestCount) ||
    guestCount < 1
  ) {
    throw Error("Guest count must be a positive integer");
  }

  // Validate dates
  const startDate = parseDate(checkIn, "check-in");
  const endDate = parseDate(checkOut, "check-out");

  const totalNights = validateDates(startDate, endDate);

  // Start MongoDB transaction
  const session = await mongoose.startSession();

  let createdBooking;

  try {
    await session.withTransaction(async () => {
      // Lock listing document to prevent concurrent bookings
      const listing = await Listing.findOneAndUpdate(
        {
          _id: listingId,
          isAvailable: true,
        },
        {
          $inc: { bookingLockVersion: 1 },
        },
        {
          new: true,
          session,
        },
      );

      if (!listing) {
        throw Error("Listing not found or unavailable");
      }

      // Prevent host from booking own listing
      if (listing.host.equals(userId)) {
        throw Error("You cannot book your own listing");
      }

      // Check maximum guests
      if (guestCount > listing.maxGuests) {
        throw Error(`This property allows maximum ${listing.maxGuests} guests`);
      }

      // Check overlapping bookings
      const conflict = await checkBookingConflict(
        listing._id,
        startDate,
        endDate,
        session,
      );

      if (conflict) {
        throw Error("Property is already booked for these dates");
      }

      // Calculate total price
      const totalPrice = totalNights * listing.pricePerNight;

      if (!Number.isSafeInteger(totalPrice)) {
        throw Error("Invalid booking price");
      }

      // Create booking using actual schema fields
      const bookings = await Booking.create(
        [
          {
            listing: listing._id,
            guest: userId,
            checkIn: startDate,
            checkOut: endDate,
            guests: guestCount,
            totalPrice,
            status: "confirmed",
            paymentStatus: "pending",
          },
        ],
        { session },
      );

      createdBooking = bookings[0];
    });

    return createdBooking;
  } finally {
    await session.endSession();
  }
};

// Get guest bookings
export const getMyBookingsService = async (userId) => {
  validateId(userId);

  return await Booking.find({
    guest: userId,
  })
    .populate("listing", "title images location pricePerNight host")
    .sort({ createdAt: -1 });
};

// Get host bookings
export const getHostBookingsService = async (userId) => {
  validateId(userId);

  const listings = await Listing.find({
    host: userId,
  }).select("_id");

  const listingIds = listings.map((listing) => listing._id);

  return await Booking.find({
    listing: { $in: listingIds },
  })
    .populate("listing", "title location images")
    .populate("guest", "name email")
    .sort({ createdAt: -1 });
};

// Cancel booking
export const cancelBookingService = async ({ bookingId, userId }) => {
  validateId(bookingId);
  validateId(userId);

  // Atomic cancellation
  const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      guest: userId,
      status: "confirmed",
      checkIn: { $gt: new Date() },
    },
    {
      $set: {
        status: "cancelled",
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!booking) {
    const existing = await Booking.findById(bookingId);

    if (!existing) {
      throw Error("Booking not found");
    }

    if (!existing.guest.equals(userId)) {
      throw Error("You cannot cancel this booking");
    }

    if (existing.status !== "confirmed") {
      throw Error("Only confirmed bookings can be cancelled");
    }

    throw Error("Booking cannot be cancelled after check-in");
  }

  return booking;
};
