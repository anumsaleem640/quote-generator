import api from "./api.js";

/**
 * quoteService.js
 * Calls the backend quote and category endpoints.
 * All calls use the shared Axios instance from api.js so the
 * Authorization header is attached automatically.
 */

// ── Quotes ─────────────────────────────────────────────────────────────────────
export const getRandomQuote = () => api.get("/quotes/random");
export const getQuoteCount = () => api.get("/quotes/count");

// ── Categories ─────────────────────────────────────────────────────────────────
export const getAllCategories = () => api.get("/categories");
