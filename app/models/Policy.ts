import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
  },
  policyId: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  premium: {
    type: Number,
    required: true,
  },
  coverageAmount: {
    type: Number,
    required: true,
  },
  tier: {
    type: String,
    required: true,
    enum: ["Basic", "Standard", "Premium"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a 2dsphere index on the location field for geospatial queries
policySchema.index({ location: "2dsphere" });

export const Policy =
  mongoose.models.Policy || mongoose.model("Policy", policySchema);
