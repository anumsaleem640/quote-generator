"use strict";

/**
 * adminRoutes.js
 * All admin routes mounted at /api/admin
 *
 * router.use(protect, adminOnly) applies BOTH middleware to every route
 * in this file with a single line — a clean, DRY way to protect an entire
 * route group. Any unauthenticated or non-admin request never reaches a handler.
 *
 * Route map:
 *   GET    /stats
 *
 *   GET    /categories
 *   POST   /categories
 *   PUT    /categories/:id
 *   DELETE /categories/:id
 *
 *   GET    /quotes
 *   GET    /quotes/:id
 *   POST   /quotes
 *   PUT    /quotes/:id
 *   DELETE /quotes/:id
 *
 *   GET    /users
 *   GET    /users/:id
 *   PATCH  /users/:id/status
 *   PATCH  /users/:id/subscription
 */

import { Router } from "express";

import { adminOnly } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = Router();

import {
  createCategory,
  createQuote,
  deleteCategory,
  deleteQuote,
  getCategories,
  getDashboardStats,
  getQuote,
  getQuotes,
  getUser,
  getUsers,
  updateCategory,
  updateQuote,
  updateUserStatus,
  updateUserSubscription,
} from "../controllers/adminController.js";

import {
  createCategoryValidation,
  createQuoteValidation,
  updateCategoryValidation,
  updateQuoteValidation,
  updateUserStatusValidation,
  updateUserSubscriptionValidation,
} from "../validators/adminValidators.js";

// ── Apply auth + role check to every route below ──────────────────────────────
router.use(protect, adminOnly);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get("/stats", getDashboardStats);

// ── Categories ────────────────────────────────────────────────────────────────
router.get("/categories", getCategories);
router.post("/categories", createCategoryValidation, validate, createCategory);
router.put(
  "/categories/:id",
  updateCategoryValidation,
  validate,
  updateCategory,
);
router.delete("/categories/:id", deleteCategory);

// ── Quotes ────────────────────────────────────────────────────────────────────
router.get("/quotes", getQuotes);
router.get("/quotes/:id", getQuote);
router.post("/quotes", createQuoteValidation, validate, createQuote);
router.put("/quotes/:id", updateQuoteValidation, validate, updateQuote);
router.delete("/quotes/:id", deleteQuote);

// ── Users ─────────────────────────────────────────────────────────────────────
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.patch(
  "/users/:id/status",
  updateUserStatusValidation,
  validate,
  updateUserStatus,
);
router.patch(
  "/users/:id/subscription",
  updateUserSubscriptionValidation,
  validate,
  updateUserSubscription,
);

export default router;
