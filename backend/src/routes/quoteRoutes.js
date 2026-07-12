"use strict";

import { Router } from "express";
import { getCount, getRandom } from "../controllers/quoteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/count", protect, getCount);
router.get("/random", protect, getRandom);

export default router;
