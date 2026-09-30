import { body } from "express-validator";

const indianPhoneRegex = /^(?:\+91[\s-]?|91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;
const customerTypes = ["Owner", "Builder", "Architect", "Contractor", "Business", "Other"];

const commonFormValidators = [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Name must be 2 to 120 characters"),
  body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Indian phone number is required")
    .matches(indianPhoneRegex)
    .withMessage("Please enter a valid Indian mobile number"),
  body("customerType").optional().isIn(customerTypes).withMessage("Please select a valid customer type"),
  body("subject").trim().isLength({ min: 3, max: 160 }).withMessage("Subject must be 3 to 160 characters"),
  body("message").trim().isLength({ min: 10, max: 2000 }).withMessage("Message must be at least 10 characters"),
  body("website").optional({ checkFalsy: true }).isEmpty().withMessage("Invalid submission")
];

export const contactValidators = commonFormValidators;

export const supportValidators = [
  ...commonFormValidators,
  body("priority").optional().isIn(["Low", "Medium", "High", "Urgent"])
];
