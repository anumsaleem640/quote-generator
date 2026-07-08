"use strict";

import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    planType: {
      type: String,
      enum: {
        values: ["free", "premium"],
        message: "{VALUE} is not a valid plan type",
      },
      required: [true, "Plan type is required"],
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // null = no expiry (free plan or lifetime premium)
    // A real Date = time-limited premium subscription
    endDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Payment Gateway Fields ─────────────────────────────────────────────
    // These fields are reserved for future Stripe / PayPal / Razorpay integration.
    // They hold neutral defaults now so the schema doesn't need to change later.

    paymentGateway: {
      type: String,
      enum: ["stripe", "paypal", "razorpay", "none"],
      default: "none",
    },

    transactionId: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      default: 0,
      min: [0, "Amount cannot be negative"],
    },

    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      maxlength: 3,
    },
  },
  {
    timestamps: true,
  },
);

// ─── INDEXES ──────────────────────────────────────────────────────────────────
// Most common query: "get this user's active subscription"
subscriptionSchema.index({ userId: 1, isActive: 1 });

// ─── INSTANCE METHODS ─────────────────────────────────────────────────────────

/**
 * Check if this subscription record is currently valid.
 * Encapsulates all expiry logic in one reusable method.
 *
 * Usage:
 *   const sub = await Subscription.findOne({ userId, isActive: true });
 *   if (sub.isValid()) { ... }
 */
subscriptionSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.endDate === null) return true; // No expiry set
  return this.endDate > new Date(); // Check against current time
};

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
