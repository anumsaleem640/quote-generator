"use strict";

import express from "express";
import mongoose from "mongoose";
import { generateHealthHtml } from "../screens/HealthScreen.js";

const router = express.Router();

router.get("/", (req, res) => {
  // 1. Calculate precise system memory statistics
  const memoryUsage = process.memoryUsage();
  const toMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  // 2. Format custom metrics payload parameters
  const metrics = {
    status: "Healthy",
    dbStatus:
      mongoose.connection.readyState === 1 ? "Connected (OK)" : "Disconnected",
    uptime: `${Math.floor(process.uptime())} seconds`,
    memory: {
      rss: toMB(memoryUsage.rss),
      heapUsed: toMB(memoryUsage.heapUsed),
      heapTotal: toMB(memoryUsage.heapTotal),
    },
    cpu: `${(process.cpuUsage().user / 1000000).toFixed(2)}s user load`,
    timestamp: new Date().toUTCString(),
  };

  // 3. Smart response content-negotiation
  if (req.accepts("html")) {
    const htmlPayload = generateHealthHtml(metrics);
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(htmlPayload);
  }

  // Fallback for automation monitoring software platforms asking for simple raw JSON
  return res.status(200).json({ success: true, ...metrics });
});

export default router;
