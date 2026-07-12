import api from "./api.js";

/**
 * authService.js
 * Functions that call the backend auth endpoints.
 * Each function returns the Axios promise so the caller can await it
 * and destructure { data } from the response.
 */

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);
export const refreshToken = (payload) => api.post("/auth/refresh", payload);
export const getCurrentUser = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");
