import {
  createReviewService,
  getListingReviewsService,
} from "../services/reviewService.js";

// Create review
export const createReview = async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  const result = await createReviewService({
    bookingId,
    userId: req.user._id,
    rating,
    comment,
  });

  return res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: result,
  });
};

// Get listing reviews
export const getListingReviews = async (req, res) => {
  const { listingId } = req.params;

  const result = await getListingReviewsService(listingId);

  return res.status(200).json({
    success: true,
    message: "Review Fetched Successfully",
    data: result,
  });
};
