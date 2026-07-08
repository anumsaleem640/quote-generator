"use strict";

import { body } from "express-validator";

// ── Register ───────────────────────────────────────────────────────────────────

const registerValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be 2–50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be 2–50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(), // lowercase, strips dots from Gmail local part

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must include an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must include a lowercase letter")
    .matches(/\d/)
    .withMessage("Password must include a number"),
];

// ── Login ──────────────────────────────────────────────────────────────────────
// Intentionally does NOT use .isEmail() — admin logs in with the string 'admin',
// not a valid email address. Service layer handles the admin/user distinction.

const loginValidation = [
  body("email").trim().notEmpty().withMessage("Email or username is required"),

  body("password").notEmpty().withMessage("Password is required"),
];

// ── Refresh Token ──────────────────────────────────────────────────────────────

const refreshValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

export { loginValidation, refreshValidation, registerValidation };
