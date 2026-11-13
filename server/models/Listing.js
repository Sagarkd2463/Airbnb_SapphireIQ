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
      trim: true,
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
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        trim: true,
      },

      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },

        longitude: {
          type: Number,
          min: -180,
          max: 180,
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
      validate: {
        validator: Number.isInteger,
        message: "Maximum guests must be a whole number",
      },
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

// Search listings by city
listingSchema.index({
  "location.city": 1,
});

// Search listings by price
listingSchema.index({
  pricePerNight: 1,
});

// Find listings by host
listingSchema.index({
  host: 1,
  createdAt: -1,
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
