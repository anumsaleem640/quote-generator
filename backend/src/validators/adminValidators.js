"use strict";

/**
 * adminValidators.js
 * express-validator rule arrays for all admin endpoints.
 *
 * Pattern: define arrays of body() rules, export them, then use in routes:
 *   router.post('/categories', createCategoryValidation, validate, createCategory)
 */

import { body } from "express-validator";

// ── Categories ─────────────────────────────────────────────────────────────────

export const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

export const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be an empty string")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

// ── Quotes ─────────────────────────────────────────────────────────────────────

export const createQuoteValidation = [
  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is required")
    .isMongoId()
    .withMessage("categoryId must be a valid MongoDB ObjectId"),

  body("quoteText")
    .trim()
    .notEmpty()
    .withMessage("Quote text is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Quote text must be between 10 and 1000 characters"),

  body("author")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Author name cannot exceed 100 characters"),
];

export const updateQuoteValidation = [
  body("quoteText")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Quote text must be between 10 and 1000 characters"),

  body("author")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Author name cannot exceed 100 characters"),

  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("categoryId must be a valid MongoDB ObjectId"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

// ── Users ──────────────────────────────────────────────────────────────────────

export const updateUserStatusValidation = [
  body("isActive")
    .exists()
    .withMessage("isActive field is required")
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

export const updateUserSubscriptionValidation = [
  body("subscriptionType")
    .notEmpty()
    .withMessage("subscriptionType is required")
    .isIn(["free", "premium"])
    .withMessage('subscriptionType must be either "free" or "premium"'),
];
