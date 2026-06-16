import { isProduction } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  const isFileSizeError = err.code === "LIMIT_FILE_SIZE";
  const statusCode = isFileSizeError ? 400 : err.statusCode || err.status || 500;

  if (!isProduction) {
    console.error(err);
  }

  return res.status(statusCode).json({
    message: isFileSizeError
      ? "Uploaded file is too large."
      : isProduction && statusCode === 500
      ? "Internal server error"
      : err.message || "Internal server error",
  });
};
