import { Router } from "express";
import {
  getPublicGallery,
  getHome,
  getPublicPage,
  getPublicProjectBySlug,
  getPublicProjects,
  getPublicServices
} from "../controllers/public.controller.js";
import { submitContact, submitSupport } from "../controllers/form.controller.js";
import { paginationValidators } from "../validators/adminProject.validators.js";
import { contactValidators, supportValidators } from "../validators/publicForm.validators.js";
import { pageSlugParam } from "../validators/adminContent.validators.js";
import { publicFormRateLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";

export const publicRoutes = Router();

publicRoutes.get("/home", getHome);
publicRoutes.get("/pages/:slug", pageSlugParam, validate, getPublicPage);
publicRoutes.get("/projects", paginationValidators, validate, getPublicProjects);
publicRoutes.get("/projects/:slug", getPublicProjectBySlug);
publicRoutes.get("/services", paginationValidators, validate, getPublicServices);
publicRoutes.get("/gallery", paginationValidators, validate, getPublicGallery);
publicRoutes.post("/contact", publicFormRateLimiter, contactValidators, validate, submitContact);
publicRoutes.post("/support", publicFormRateLimiter, supportValidators, validate, submitSupport);
