"use strict";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import your split datasets
import { initialCategories } from "./categoriesData.js";
import { initialQuotes } from "./quotesData.js";
import { defaultSettings } from "./settingsData.js";

dotenv.config();

const runReset = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing!");
    }

    console.log("📡 Connecting to MongoDB Cluster...");
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    console.log(`📌 Database Target: "${db.databaseName}"\n`);

    // ────────────────────────────────────────────────────────────────
    // STEP 1: WIPE OLD DATA
    // ────────────────────────────────────────────────────────────────
    console.log("🗑️  Wiping existing data...");
    await db.collection("settings").deleteMany({});
    await db.collection("users").deleteMany({});
    await db.collection("categories").deleteMany({});
    await db.collection("quotes").deleteMany({});
    console.log("✅ Collections cleared out safely.\n");

    // ────────────────────────────────────────────────────────────────
    // STEP 2: SEED SETTINGS
    // ────────────────────────────────────────────────────────────────
    console.log("⚙️  Seeding System Settings...");
    const cleanSettings = defaultSettings.map((s) => ({
      ...s,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await db.collection("settings").insertMany(cleanSettings);
    console.log(
      `✅ Successfully seeded ${cleanSettings.length} settings options.`,
    );

    // ────────────────────────────────────────────────────────────────
    // STEP 3: CREATE ADMIN USER (Auto-generating ID)
    // ────────────────────────────────────────────────────────────────
    console.log("\n👑 Building Default System Admin Account...");
    const hashedPassword = await bcrypt.hash("123456As", 12);

    // Notice we do NOT supply an _id property here; MongoDB will make it for us
    const adminUser = {
      firstName: "Admin",
      lastName: "System",
      email: "admin@gmail.com",
      username: "admin",
      passwordHash: hashedPassword,
      role: "admin",
      selectedCategories: [],
      quoteRefreshInterval: "1hour",
      subscriptionType: "free",
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    };

    const userResult = await db.collection("users").insertOne(adminUser);
    const dynamicAdminId = userResult.insertedId; // 👈 Capture the auto-generated ObjectId
    console.log(
      `✅ Admin Account created dynamically! Generated ID: ${dynamicAdminId}`,
    );

    // ────────────────────────────────────────────────────────────────
    // STEP 4: SEED CATEGORIES (Using dynamic Admin ID)
    // ────────────────────────────────────────────────────────────────
    console.log("\n📁 Seeding Categories collection...");
    const cleanCategories = initialCategories.map((cat) => ({
      ...cat,
      createdBy: dynamicAdminId, // 👈 Assigned dynamically
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const catResult = await db
      .collection("categories")
      .insertMany(cleanCategories);
    console.log(`✅ Seeded ${catResult.insertedCount} Categories.`);

    // Fetch the generated categories so we can grab their new IDs dynamically
    const seededCatsFromDb = await db
      .collection("categories")
      .find({})
      .toArray();

    // ────────────────────────────────────────────────────────────────
    // STEP 5: SEED QUOTES (Dynamic Category & Admin Links)
    // ────────────────────────────────────────────────────────────────
    console.log("\n💬 Mapping & Seeding Quotes...");
    let quotesToInsert = [];

    seededCatsFromDb.forEach((cat) => {
      const categoryQuotes = initialQuotes[cat.name];
      if (categoryQuotes) {
        categoryQuotes.forEach((q) => {
          quotesToInsert.push({
            ...q,
            categoryId: cat._id, // Hook up relation dynamically
            createdBy: dynamicAdminId, // 👈 Assigned dynamically
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
    });

    if (quotesToInsert.length > 0) {
      const quoteResult = await db
        .collection("quotes")
        .insertMany(quotesToInsert);
      console.log(
        `✅ Seeded ${quoteResult.insertedCount} Quotes perfectly associated to their parents.`,
      );
    }

    console.log(
      "\n\x1b[32m🎉 DATABASE ENTIRELY RESET AND SEEDED SUCCESSFULLY!\x1b[0m\n",
    );
  } catch (err) {
    console.error("\n❌ Database reset failed prematurely:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Connection wrapper dropped cleanly.");
    process.exit(0);
  }
};

runReset();
