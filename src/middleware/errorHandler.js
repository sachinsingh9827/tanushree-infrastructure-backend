import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errors: []
  });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const isProduction = env.nodeEnv === "production";

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && isProduction ? "Internal server error" : error.message,
    errors: isProduction ? [] : [{ stack: error.stack }]
  });
}
