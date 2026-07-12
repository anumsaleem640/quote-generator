"use strict";

import mongoose from "mongoose";
import Category from "../models/Category.js";
import Setting from "../models/Setting.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

// ── Helper ─────────────────────────────────────────────────────────────────────

/**
 * Strip internal fields before returning user data to the client.
 * passwordHash has select:false in the schema, but we strip it defensively
 * in case a query was constructed with .select('+passwordHash').
 */
export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

// ── updateSelectedCategories ───────────────────────────────────────────────────

/**
 * Replaces the user's entire category selection with the provided list.
 *
 * Rules enforced:
 *  1. Free users cannot exceed MAX_FREE_CATEGORIES (read from Settings).
 *  2. Every ID in the list must correspond to a real, active category.
 *  3. An empty array is valid — the user is clearing their selection.
 */
export const updateSelectedCategories = async (userId, categoryIds) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found.");

  // ── Plan limit check ───────────────────────────────────────────────────────
  let maxFree = 5; // hard fallback
  try {
    const setting = await Setting.findOne({ key: "MAX_FREE_CATEGORIES" });
    if (setting?.value != null) maxFree = Number(setting.value);
  } catch (_) {
    // Settings table may be empty on a fresh database — use the default
  }

  if (user.subscriptionType === "free" && categoryIds.length > maxFree) {
    throw new ApiError(
      `Your free plan allows up to ${maxFree} categories. ` +
        `You selected ${categoryIds.length}. ` +
        `Upgrade to Premium for unlimited category access.`,
      403,
    );
  }

  // ── Category existence check ───────────────────────────────────────────────
  if (categoryIds.length > 0) {
    const objectIds = categoryIds.map((id) => new mongoose.Types.ObjectId(id));

    const found = await Category.find({
      _id: { $in: objectIds },
      isActive: true,
    }).select("_id");

    // If the count doesn't match, at least one ID was invalid or inactive.
    // We don't reveal which one — just reject the whole request.
    if (found.length !== categoryIds.length) {
      throw ApiError.badRequest(
        "One or more selected categories do not exist or are no longer active.",
      );
    }
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { selectedCategories: categoryIds },
    { new: true }, // return the updated document
  ).populate("selectedCategories", "name description");

  return sanitizeUser(updated);
};

// ── updateRefreshInterval ──────────────────────────────────────────────────────

/**
 * Updates the user's quote auto-refresh frequency.
 * runValidators: true applies the Mongoose enum check as a safety net
 * on top of the express-validator rule that already ran in the route.
 */
export const updateRefreshInterval = async (userId, quoteRefreshInterval) => {
  const updated = await User.findByIdAndUpdate(
    userId,
    { quoteRefreshInterval },
    { new: true, runValidators: true },
  ).populate("selectedCategories", "name description");

  if (!updated) throw ApiError.notFound("User not found.");
  return sanitizeUser(updated);
};

// ── getUserProfile ─────────────────────────────────────────────────────────────

/**
 * Returns the full user profile with populated category documents.
 * Used by the dashboard to display: name, plan, categories, and interval.
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).populate(
    "selectedCategories",
    "name description",
  );

  if (!user) throw ApiError.notFound("User not found.");
  return sanitizeUser(user);
};

export default {
  sanitizeUser,
  updateSelectedCategories,
  updateRefreshInterval,
  getUserProfile,
};
