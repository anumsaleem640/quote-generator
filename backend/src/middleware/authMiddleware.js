"use strict";

import User from "../models/User.js";
import apiError from "../utils/apiError.js";
import { isBlacklisted } from "../utils/tokenBlacklist.js";
import { verifyAccessToken } from "../utils/tokenUtils.js";

export const protect = async (req, res, next) => {
  try {
    // Step 1: Extract Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw apiError.unauthorized(
        "No authentication token provided. Please log in.",
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "undefined") {
      throw apiError.unauthorized("Token is malformed. Please log in again.");
    }

    // Step 2: Verify signature and expiry
    const decoded = verifyAccessToken(token);

    // Step 3: Check the blacklist (Phase 14 addition)
    // A valid, non-expired token whose JTI appears in the blacklist means
    // the user has explicitly logged out. Reject immediately.
    if (decoded.jti && isBlacklisted(decoded.jti)) {
      throw apiError.unauthorized(
        "This session has been ended. Please log in again.",
      );
    }

    // Step 4: Admin shortcut — no DB lookup needed
    if (decoded.role === "admin") {
      req.user = decoded;
      return next();
    }

    // Step 5: Confirm user still exists and is active
    const user = await User.findById(decoded.userId).populate(
      "selectedCategories",
      "name description",
    );

    if (!user) {
      throw apiError.unauthorized("This account no longer exists.");
    }
    if (!user.isActive) {
      throw apiError.unauthorized(
        "Your account has been deactivated. Please contact support.",
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
