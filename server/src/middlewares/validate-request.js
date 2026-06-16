import { ApiError } from "../utils/api-error.js";

export const validateRequest = (schema) => (req, res, next) => {
  const errors = [];

  if (schema.body) {
    const bodyErrors = schema.body(req.body);
    errors.push(...bodyErrors);
  }

  if (schema.query) {
    const queryErrors = schema.query(req.query);
    errors.push(...queryErrors);
  }

  if (schema.params) {
    const paramsErrors = schema.params(req.params);
    errors.push(...paramsErrors);
  }

  if (errors.length) {
    return next(new ApiError(400, errors.join(" ")));
  }

  return next();
};
