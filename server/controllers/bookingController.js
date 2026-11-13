import {
  checkAvailabilityService,
  createBookingService,
  getMyBookingsService,
  getHostBookingsService,
  cancelBookingService,
} from "../services/bookingService.js";

// Check availability
export const checkAvailability = async (req, res) => {
  const { listingId } = req.params;
  const { checkIn, checkOut } = req.query;

  const result = await checkAvailabilityService({
    listingId,
    checkIn,
    checkOut,
  });

  res.status(200).json({
    success: true,
    message: "Availability checked successfully",
    data: result,
  });
};

// Create booking
export const createBooking = async (req, res) => {
  const { listingId, checkIn, checkOut, guests } = req.body;

  const booking = await createBookingService({
    listingId,
    userId: req.user._id,
    checkIn,
    checkOut,
    guests,
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
};

// Get guest bookings
export const getMyBookings = async (req, res) => {
  const bookings = await getMyBookingsService(req.user._id);

  res.status(200).json({
    success: true,
    message: "Your bookings fetched successfully",
    data: bookings,
  });
};

// Get host bookings
export const getHostBookings = async (req, res) => {
  const bookings = await getHostBookingsService(req.user._id);

  res.status(200).json({
    success: true,
    message: "Host bookings fetched successfully",
    data: bookings,
  });
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  const booking = await cancelBookingService({
    bookingId: req.params.id,
    userId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
};
