"use strict";

import express from "express";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  loginLimiter,
  refreshLimiter,
  registerLimiter,
} from "../middleware/rateLimiters.js";
import validate from "../middleware/validate.js";
import {
  loginValidation,
  refreshValidation,
  registerValidation,
} from "../validators/authValidators.js";

const router = express.Router();

// Public routes — rate-limited individually
router.post(
  "/register",
  registerLimiter,
  registerValidation,
  validate,
  register,
);
router.post("/login", loginLimiter, loginValidation, validate, login);
router.post("/refresh", refreshLimiter, refreshValidation, validate, refresh);

// Protected routes — general fallback limiter in app.js covers these
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
