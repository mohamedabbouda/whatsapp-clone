import { isProduction } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (!isProduction) {
    console.error(err);
  }

  return res.status(statusCode).json({
    message:
      isProduction && statusCode === 500
        ? "Internal server error"
        : err.message || "Internal server error",
  });
};
