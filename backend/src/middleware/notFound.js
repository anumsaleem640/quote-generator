"use strict";

import { generateNotFoundHtml } from "../screens/NotFoundScreen.js";

export const notFound = (req, res, next) => {
  const method = req.method;
  const requestedPath = req.originalUrl;

  // If a browser is looking for a web page, give it the beautiful screen
  if (req.accepts("html")) {
    const htmlPayload = generateNotFoundHtml({ method, requestedPath });
    res.setHeader("Content-Type", "text/html");
    return res.status(404).send(htmlPayload);
  }

  // Fallback default response for developers using Postman / code API fetch clients
  return res.status(404).json({
    success: false,
    error: {
      code: "RESOURCE_NOT_FOUND",
      message: "The requested path could not be found on this server.",
      details: { method, requestedPath },
    },
  });
};

export default notFound;
