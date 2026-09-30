import { body } from "express-validator";
import { mongoIdParam } from "./adminProject.validators.js";

export const contactStatusValidators = [
  ...mongoIdParam,
  body("status").isIn(["New", "Read", "In Progress", "Resolved", "Spam"])
];

export const supportUpdateValidators = [
  ...mongoIdParam,
  body("status").optional().isIn(["Open", "In Progress", "Waiting", "Resolved", "Closed"]),
  body("priority").optional().isIn(["Low", "Medium", "High", "Urgent"]),
  body("adminReply").optional().trim().isLength({ max: 2000 })
];
