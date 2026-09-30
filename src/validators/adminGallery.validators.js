import { body } from "express-validator";
import { mongoIdParam } from "./adminProject.validators.js";

export const galleryCreateValidators = [
  body("title").trim().isLength({ min: 2, max: 160 }),
  body("caption").optional().trim().isLength({ max: 300 }),
  body("status").optional().isIn(["published", "draft"]),
  body("sortOrder").optional().toInt().isInt()
];

export const galleryUpdateValidators = [
  ...mongoIdParam,
  body("title").optional().trim().isLength({ min: 2, max: 160 }),
  body("caption").optional().trim().isLength({ max: 300 }),
  body("status").optional().isIn(["published", "draft"]),
  body("sortOrder").optional().toInt().isInt()
];
