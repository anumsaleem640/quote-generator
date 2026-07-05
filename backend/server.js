"use strict";

import "dotenv/config";
import app from "./src/app.js";
import { validateEnv } from "./src/config/env.js";
import connectDB from "./src/database/database.js";

import { exec } from "child_process";

const PORT = process.env.PORT || 5550;
const NODE_ENV = process.env.NODE_ENV || "development";

// Track if we've already opened the browser during this session
let browserOpened = false;

const startServer = async () => {
  try {
    // Step 1: Fail fast if any required env vars are missing
    validateEnv();

    // Step 2: Connect to MongoDB Atlas before accepting any requests
    await connectDB();

    // Step 3: Start the HTTP server
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running in ${NODE_ENV} mode`);

      // Automatically open the server root landing dashboard in your browser
      if (NODE_ENV === "development" && !browserOpened) {
        const serverUrl = `http://localhost:${PORT}/api`;

        // Detect OS platform type and execute the native launch command
        const startCommand =
          process.platform === "darwin"
            ? `open "${serverUrl}"` // macOS
            : process.platform === "win32"
              ? `start "${serverUrl}"` // Windows
              : `xdg-open "${serverUrl}"`; // Linux

        exec(startCommand, (err) => {
          if (err) {
            console.log(
              `💡 Note: Server running, but couldn't auto-launch browser: ${serverUrl}`,
            );
          }
        });

        browserOpened = true;
      }
    });

    // ── Graceful shutdown handlers ────────────────────────────────────────────

    // Unhandled promise rejections (e.g. a forgotten .catch() in a controller)
    process.on("unhandledRejection", (err) => {
      console.error("\n❌ UNHANDLED REJECTION — shutting down server");
      console.error(`   ${err.name}: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // SIGTERM is sent by Docker, Render, and other process managers on graceful shutdown.
    process.on("SIGTERM", () => {
      console.log("\n⚠️  SIGTERM received — shutting down gracefully");
      server.close(() => {
        console.log("✅ Server closed\n");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("\n❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
