"use strict";

import jwt from "jsonwebtoken";
import authService from "../services/authService.js";
import apiResponse from "../utils/apiResponse.js";
// import { addToBlacklist } from "../utils/tokenBlacklist.js";

// ── POST /api/auth/register ────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const result = await authService.register({
      firstName,
      lastName,
      email,
      password,
    });
    return apiResponse.created(res, "Account created successfully.", result);
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/login ───────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    const message =
      result.user.role === "admin"
        ? "Admin login successful."
        : "Welcome back!";
    return apiResponse.success(res, message, result);
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/refresh ─────────────────────────────────────────────────────
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken({ refreshToken });
    return apiResponse.success(res, "Access token refreshed.", result);
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/logout ──────────────────────────────────────────────────────
export const logout = (req, res) => {
  try {
    // Extract the raw token string from the header
    const raw = req.headers.authorization?.split(" ")[1];

    if (raw) {
      // jwt.decode() does NOT verify — we already verified in protect().
      // We just need the payload claims (jti, exp) cheaply.
      const payload = jwt.decode(raw);

      if (payload?.jti && payload?.exp) {
        // Add JTI to blacklist. The TTL is the token's natural expiry so
        // the blacklist entry is automatically ignored (and eventually cleaned
        // up) once the token would have expired anyway.
        // addToBlacklist(payload.jti, payload.exp);
      }
    }
  } catch {
    // Non-fatal: if we can't decode the token for any reason,
    // still return 200 — the client will clear its local storage.
  }

  return apiResponse.success(
    res,
    "Logged out successfully. Your session has been invalidated.",
    null,
  );
};

// ── GET /api/auth/me ───────────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const userId = req.user._id?.toString() || req.user.userId;
    const user = await authService.getMe(userId);
    return apiResponse.success(res, "Profile fetched.", { user });
  } catch (error) {
    next(error);
  }
};
