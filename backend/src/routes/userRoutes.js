"use strict";
import { Router } from "express";
import {
  getProfile,
  updateCategories,
  updateSettings,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  updateCategoriesValidation,
  updateSettingsValidation,
} from "../validators/userValidators.js";

const router = Router();

router.get("/profile", protect, getProfile);

router.put(
  "/categories",
  protect,
  updateCategoriesValidation,
  validate,
  updateCategories,
);

router.put(
  "/settings",
  protect,
  updateSettingsValidation,
  validate,
  updateSettings,
);

export default router;
