import { body } from "express-validator";
import { mongoIdParam } from "./adminProject.validators.js";

export const serviceCreateValidators = [
  body("title").trim().isLength({ min: 2, max: 160 }),
  body("shortDescription").optional().trim().isLength({ max: 300 }),
  body("featured").optional().toBoolean().isBoolean(),
  body("status").optional().isIn(["active", "inactive"]),
  body("sortOrder").optional().toInt().isInt()
];

export const serviceUpdateValidators = [
  ...mongoIdParam,
  body("title").optional().trim().isLength({ min: 2, max: 160 }),
  body("shortDescription").optional().trim().isLength({ max: 300 }),
  body("featured").optional().toBoolean().isBoolean(),
  body("status").optional().isIn(["active", "inactive"]),
  body("sortOrder").optional().toInt().isInt()
];
