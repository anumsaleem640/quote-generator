"use strict";

import { Router } from "express";
import { getAll, getById } from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getAll);
router.get("/:id", protect, getById);

export default router;
