import mongoose from "mongoose";

const policyDetailsSchema = new mongoose.Schema({
  policyId: {
    type: String,
    required: true,
    unique: true,
  },
  userAddress: {
    type: String,
    required: true,
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
    address: {
      type: String,
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
  status: {
    type: String,
    enum: ["Active", "Inactive", "Expired", "Claimed", "Redeemed"],
    default: "Active",
  },
  weatherHistory: [
    {
      date: Date,
      temperature: Number,
      weatherText: String,
      humidity: Number,
      precipitation: Number,
    },
  ],
  claims: [
    {
      date: Date,
      amount: Number,
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
      },
      reason: String,
      weatherData: {
        temperature: Number,
        weatherText: String,
        humidity: Number,
        precipitation: Number,
      },
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  lastWeatherUpdate: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
  },
  resolutionDetails: {
    disputeId: String,
    outcome: {
      type: String,
      enum: ["Approved", "Rejected"],
    },
    resolvedAt: Date,
    resolvedBy: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
policyDetailsSchema.index({ location: "2dsphere" });
policyDetailsSchema.index({ userAddress: 1 });
policyDetailsSchema.index({ policyId: 1 }, { unique: true });
policyDetailsSchema.index({ status: 1 });

export const PolicyDetails =
  mongoose.models.PolicyDetails ||
  mongoose.model("PolicyDetails", policyDetailsSchema);
