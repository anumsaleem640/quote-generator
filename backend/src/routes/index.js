"use strict";

import express from "express";
// import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import healthRoutes from "./healthRoutes.js";
// import quoteRoutes from "./quoteRoutes.js";
// import userRoutes from "./userRoutes.js";
import { generateDashboardHtml } from "../screens/DashboardScreen.js";

// Initialize the router object correctly
const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
// router.use("/quotes", quoteRoutes);
router.use("/categories", categoryRoutes);
// router.use("/users", userRoutes);
// router.use("/admin", adminRoutes);

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

export default router;
