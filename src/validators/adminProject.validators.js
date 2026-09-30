import { body, param, query } from "express-validator";

export const mongoIdParam = [param("id").isMongoId().withMessage("Invalid id")];
export const imageIdParam = [param("imageId").isMongoId().withMessage("Invalid image id")];

export const paginationValidators = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

export const projectCreateValidators = [
  body("title").trim().isLength({ min: 2, max: 160 }),
  body("shortDescription").optional().trim().isLength({ max: 300 }),
  body("status").optional().isIn(["Completed", "Ongoing", "Upcoming"]),
  body("featured").optional().toBoolean().isBoolean(),
  body("published").optional().toBoolean().isBoolean(),
  body("sortOrder").optional().toInt().isInt()
];

export const projectUpdateValidators = [
  ...mongoIdParam,
  body("title").optional().trim().isLength({ min: 2, max: 160 }),
  body("shortDescription").optional().trim().isLength({ max: 300 }),
  body("status").optional().isIn(["Completed", "Ongoing", "Upcoming"]),
  body("featured").optional().toBoolean().isBoolean(),
  body("published").optional().toBoolean().isBoolean(),
  body("sortOrder").optional().toInt().isInt()
];
