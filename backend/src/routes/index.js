"use strict";

/**
 * routes/index.js — central route registry
 * Mounted at /api in app.js.
 *
 * Full route map after Phase 6:
 *   /api/health          → healthRoutes
 *   /api/auth/*          → authRoutes       (Phase 4)
 *   /api/quotes/*        → quoteRoutes      (Phase 5)
 *   /api/categories/*    → categoryRoutes   (Phase 5)
 *   /api/users/*         → userRoutes       (Phase 5)
 *   /api/admin/*         → adminRoutes      (Phase 6)
 */

import express from "express";
// import adminRoutes from "./adminRoutes.js";
// import authRoutes from "./authRoutes.js";
// import categoryRoutes from "./categoryRoutes.js";
import healthRoutes from "./healthRoutes.js";
// import quoteRoutes from "./quoteRoutes.js";
// import userRoutes from "./userRoutes.js";
import { generateDashboardHtml } from "../screens/DashboardScreen.js";

// Initialize the router object correctly
const router = express.Router();

router.use("/health", healthRoutes);
// router.use("/auth", authRoutes);
// router.use("/quotes", quoteRoutes);
// router.use("/categories", categoryRoutes);
// router.use("/users", userRoutes);
// router.use("/admin", adminRoutes);

// Add this friendly root landing endpoint:
// router.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Welcome to the Quote Generator API Gateway!",
//     status: "online",
//   });
// });

router.get("/", (req, res) => {
  // Collect state statistics variables
  const environment = process.env.NODE_ENV || "development";
  const uptime = Math.floor(process.uptime());
  const timestamp = new Date().toLocaleString();

  // Generate view layout from external file layout
  const htmlPayload = generateDashboardHtml({ environment, uptime, timestamp });

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(htmlPayload);
});

// module.exports = router;
export default router;
