import { body, param } from "express-validator";

export const pageSlugParam = [
  param("slug").trim().isSlug().isLength({ min: 2, max: 80 })
];

export const pageUpdateValidators = [
  ...pageSlugParam,
  body("title").trim().isLength({ min: 2, max: 160 }),
  body("content").optional().isString(),
  body("seoTitle").optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body("seoDescription").optional({ checkFalsy: true }).trim().isLength({ max: 300 }),
  body("status").optional().isIn(["published", "draft"])
];

export const settingsUpdateValidators = [
  body("companyName").optional().trim().isLength({ min: 2, max: 160 }),
  body("email").optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  body("phone").optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body("alternatePhone").optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body("address").optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body("googleMapUrl").optional({ checkFalsy: true }).isURL(),
  body("facebook").optional({ checkFalsy: true }).isURL(),
  body("instagram").optional({ checkFalsy: true }).isURL(),
  body("linkedin").optional({ checkFalsy: true }).isURL(),
  body("youtube").optional({ checkFalsy: true }).isURL(),
  body("whatsapp").optional({ checkFalsy: true }).trim().isLength({ max: 80 }),
  body("footerText").optional({ checkFalsy: true }).trim().isLength({ max: 500 })
];
