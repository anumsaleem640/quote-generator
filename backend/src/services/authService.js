"use strict";

import Category from "../models/Category.js";
import Setting from "../models/Setting.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import apiError from "../utils/apiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenUtils.js";

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Strip internal fields before sending a user to the client.
 * passwordHash has select:false in the schema, so it is usually absent
 * already — this is a defensive double-removal.
 */
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

/**
 * Build the token pair + sanitized user object returned by register and login.
 */
const buildAuthResponse = (tokenPayload, userDocument) => {
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({ userId: tokenPayload.userId });
  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(userDocument),
  };
};

/**
 * Return `count` random active category IDs using MongoDB's $sample aggregation.
 * Falls back to [] gracefully when no categories exist (fresh database).
 */
const getRandomCategoryIds = async (count = 2) => {
  const categories = await Category.aggregate([
    { $match: { isActive: true } },
    { $sample: { size: count } },
  ]);
  return categories.map((c) => c._id);
};

// ── Register ───────────────────────────────────────────────────────────────────

const register = async ({ firstName, lastName, email, password }) => {
  // 1. Email uniqueness check — gives a clear error before Mongoose tries to
  //    save and triggers a less readable duplicate-key exception.
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw apiError.conflict(
      "An account with this email already exists. Please log in instead.",
    );
  }

  // 2. Auto-generate a collision-safe username from the email.
  //    generateUsername() is a static method defined on the User schema.
  //    e.g. "john.smith@gmail.com" → "johnsmith" (or "johnsmith1" if taken)
  const username = await User.generateUsername(email);

  // 3. Read the auto-assign count from Settings (default: 2 if unset).
  let autoAssignCount = 2;
  try {
    const setting = await Setting.findOne({
      key: "AUTO_ASSIGN_CATEGORIES_COUNT",
    });
    if (setting?.value) autoAssignCount = setting.value;
  } catch (_) {
    // Non-critical — continue with the default value
  }

  // 4. Pick random categories for the new user's initial selection.
  const selectedCategories = await getRandomCategoryIds(autoAssignCount);

  // 5. Create the user document.
  //    We set passwordHash to the plain-text password here.
  //    The pre-save hook in User.js (added in Phase 4) hashes it automatically
  //    before the document reaches MongoDB.
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    passwordHash: password, // ← plain text here; pre-save hook converts it
    selectedCategories,
  });

  // 6. Create a free-tier subscription record to track plan history.
  await Subscription.create({
    userId: user._id,
    planType: "free",
    startDate: new Date(),
  });

  // 7. Fetch the fully populated user (category names instead of raw IDs)
  //    to include in the response.
  const populatedUser = await User.findById(user._id).populate(
    "selectedCategories",
    "name description",
  );

  // 8. Generate tokens and return.
  const payload = { userId: user._id, role: user.role, email: user.email };
  return buildAuthResponse(payload, populatedUser);
};

// ── Login ──────────────────────────────────────────────────────────────────────

const login = async ({ email, password }) => {
  // ── Admin credentials check ──────────────────────────────────────────────
  // Admin is not stored in the database. Credentials live in environment variables.
  // When they match, skip the DB entirely and issue an admin-scoped JWT.
  if (
    email === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const adminPayload = {
      userId: "admin",
      role: "admin",
      email: "admin@system.local",
    };
    return {
      accessToken: generateAccessToken(adminPayload),
      refreshToken: generateRefreshToken({ userId: "admin" }),
      user: { role: "admin", firstName: "Admin" },
    };
  }

  // ── Regular user login ───────────────────────────────────────────────────

  // .select('+passwordHash') overrides the schema's select:false so we can
  // run bcrypt.compare(). Without this, passwordHash is undefined.
  const user = await User.findOne({ email: email.toLowerCase().trim() })
    .select("+passwordHash")
    .populate("selectedCategories", "name description");

  // Generic error — don't reveal whether the email exists.
  if (!user) {
    throw apiError.unauthorized("Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw apiError.unauthorized("Invalid email or password.");
  }

  if (!user.isActive) {
    throw apiError.forbidden(
      "Your account has been deactivated. Please contact support.",
    );
  }

  // Update last login timestamp without triggering the pre-save hook.
  // findByIdAndUpdate bypasses Mongoose hooks intentionally here.
  await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

  const payload = { userId: user._id, role: user.role, email: user.email };
  return buildAuthResponse(payload, user);
};

// ── Refresh Access Token ───────────────────────────────────────────────────────

const refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw apiError.unauthorized("No refresh token provided.");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (_) {
    throw apiError.unauthorized(
      "Invalid or expired refresh token. Please log in again.",
    );
  }

  // Admin: no DB needed — re-issue directly.
  if (decoded.userId === "admin") {
    const adminPayload = {
      userId: "admin",
      role: "admin",
      email: "admin@system.local",
    };
    return { accessToken: generateAccessToken(adminPayload) };
  }

  // Regular user: confirm account still exists.
  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw apiError.unauthorized("User not found or account deactivated.");
  }

  const newAccessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
    email: user.email,
  });

  return { accessToken: newAccessToken };
};

// ── Get Current User ───────────────────────────────────────────────────────────

const getMe = async (userId) => {
  // Admin is not in the database — return a minimal object.
  if (userId === "admin") {
    return { role: "admin", firstName: "Admin" };
  }

  const user = await User.findById(userId).populate(
    "selectedCategories",
    "name description",
  );

  if (!user) {
    throw apiError.notFound("User not found.");
  }

  return sanitizeUser(user);
};

export default { register, login, refreshAccessToken, getMe };
