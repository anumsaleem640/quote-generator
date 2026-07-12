"use strict";

/**
 * adminService.js
 * Dashboard statistics and user account management.
 *
 * Promise.all() is used throughout for concurrent DB queries — running
 * independent counts in parallel is 3-5× faster than awaiting them
 * sequentially when each takes ~20ms.
 */

import Category from "../models/Category.js";
import Quote from "../models/Quote.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

// ── getDashboardStats ──────────────────────────────────────────────────────────

/**
 * Returns a snapshot of the entire application:
 *  users   — total, active/inactive split, free/premium split
 *  content — active category and quote counts
 *
 * All five DB calls run in parallel with Promise.all so the response
 * arrives in the time of the slowest single query, not their sum.
 */
export const getDashboardStats = async () => {
  const [totalUsers, activeUsers, premiumUsers, totalCategories, totalQuotes] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ subscriptionType: "premium" }),
      Category.countDocuments({ isActive: true }),
      Quote.countDocuments({ isActive: true }),
    ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      free: totalUsers - premiumUsers,
      premium: premiumUsers,
    },
    content: {
      categories: totalCategories,
      quotes: totalQuotes,
    },
  };
};

// ── getAllUsers ─────────────────────────────────────────────────────────────────

/**
 * Paginated user list with optional full-text search across name and email.
 * Always sorted newest-first so recently registered accounts appear at the top.
 */
export const getAllUsers = async ({
  page = 1,
  limit = 20,
  search = "",
} = {}) => {
  const query = search
    ? {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-passwordHash -__v")
      .populate("selectedCategories", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ── getUserById ────────────────────────────────────────────────────────────────

export const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select("-passwordHash -__v")
    .populate("selectedCategories", "name description");

  if (!user) throw ApiError.notFound("User not found.");
  return user;
};

// ── updateUserStatus ───────────────────────────────────────────────────────────

/**
 * Activate or deactivate a user account.
 * Deactivated users cannot log in — protect() rejects their token
 * at the "confirm account is still active" step.
 */
export const updateUserStatus = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true },
  ).select("-passwordHash -__v");

  if (!user) throw ApiError.notFound("User not found.");
  return user;
};

// ── updateUserSubscription ─────────────────────────────────────────────────────

/**
 * Change a user's subscription tier (free ↔ premium).
 * Creates a new Subscription record as an audit trail so you can see
 * when and how many times the plan changed.
 */
export const updateUserSubscription = async (userId, subscriptionType) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { subscriptionType },
    { new: true },
  ).select("-passwordHash -__v");

  if (!user) throw ApiError.notFound("User not found.");

  // Audit record — the full history is preserved even after downgrades
  await Subscription.create({
    userId,
    planType: subscriptionType,
    startDate: new Date(),
  });

  return user;
};

export default {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserSubscription,
};
