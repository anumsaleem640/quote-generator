"use strict";

import userService from "../services/userService.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ── Guard helper ───────────────────────────────────────────────────────────────
/**
 * Returns true if the request is from a regular user.
 * Returns false and calls next(403) if the request is from admin.
 * Controllers call: if (!guardUser(req, next)) return;
 */
export const guardUser = (req, next) => {
  if (req.user.role === "admin") {
    next(ApiError.forbidden("This endpoint is for registered users only."));
    return false;
  }
  return true;
};

// ── GET /api/users/profile ─────────────────────────────────────────────────────
export const getProfile = async (req, res, next) => {
  try {
    if (!guardUser(req, next)) return;
    const user = await userService.getUserProfile(req.user._id.toString());
    return ApiResponse.success(res, "Profile fetched.", { user });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/users/categories ──────────────────────────────────────────────────
export const updateCategories = async (req, res, next) => {
  try {
    if (!guardUser(req, next)) return;
    const user = await userService.updateSelectedCategories(
      req.user._id.toString(),
      req.body.categoryIds,
    );
    return ApiResponse.success(res, "Categories updated successfully.", {
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/users/settings ────────────────────────────────────────────────────
export const updateSettings = async (req, res, next) => {
  try {
    if (!guardUser(req, next)) return;
    const user = await userService.updateRefreshInterval(
      req.user._id.toString(),
      req.body.quoteRefreshInterval,
    );
    return ApiResponse.success(res, "Settings updated successfully.", { user });
  } catch (error) {
    next(error);
  }
};

export default { getProfile, updateCategories, updateSettings };
