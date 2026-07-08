"use strict";

import { validationResult } from "express-validator";
import apiError from "../utils/apiError.js";

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // Collect every failure message into one readable string.
    // Example: "First name is required | Password must be at least 8 characters"
    const messages = result
      .array()
      .map((err) => err.msg)
      .join(" | ");

    return next(new apiError(messages, 400));
  }

  next();
};

export default validate;
