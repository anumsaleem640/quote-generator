"use strict";

import crypto from "crypto";
import jwt from "jsonwebtoken";

// ── Access Token ───────────────────────────────────────────────────────────────

const generateAccessToken = (payload) => {
  return jwt.sign(
    { ...payload, jti: crypto.randomUUID() }, // unique per token
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// ── Refresh Token ──────────────────────────────────────────────────────────────

const generateRefreshToken = (payload) => {
  return jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" },
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
