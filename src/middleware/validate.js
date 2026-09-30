import { validationResult } from "express-validator";
import { failure } from "../utils/apiResponse.js";

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
    return;
  }

  failure(res, "Validation failed", result.array(), 422);
}
