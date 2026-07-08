"use strict";

import { body } from "express-validator";
import mongoose from "mongoose";

// ── PUT /api/users/categories ──────────────────────────────────────────────────
export const updateCategoriesValidation = [
  body("categoryIds")
    .exists()
    .withMessage("categoryIds field is required")
    .isArray({ min: 0 })
    .withMessage(
      "categoryIds must be an array (can be empty to clear selection)",
    )
    .custom((ids) => {
      // Validate every element is a syntactically valid MongoDB ObjectId.
      // Service layer separately confirms each ID exists and is active.
      const allValid = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
      if (!allValid) {
        throw new Error(
          "Every item in categoryIds must be a valid MongoDB ObjectId",
        );
      }
      return true;
    }),
];

// ── PUT /api/users/settings ────────────────────────────────────────────────────
export const updateSettingsValidation = [
  body("quoteRefreshInterval")
    .notEmpty()
    .withMessage("quoteRefreshInterval is required")
    .isIn(["1min", "1hour", "1day"])
    .withMessage("quoteRefreshInterval must be one of: 1min, 1hour, 1day"),
];

export default { updateCategoriesValidation, updateSettingsValidation };
