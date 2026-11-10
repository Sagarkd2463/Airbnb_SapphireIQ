import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Hotel", "Guesthouse", "Other"],
      default: "Apartment",
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 1,
    },

    location: {
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },

      coordinates: {
        latitude: {
          type: Number,
        },

        longitude: {
          type: Number,
        },
      },
    },

    images: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },

    bedrooms: {
      type: Number,
      default: 1,
      min: 0,
    },

    bathrooms: {
      type: Number,
      default: 1,
      min: 0,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    bookingLockVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
