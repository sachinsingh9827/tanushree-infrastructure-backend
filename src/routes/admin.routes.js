import { Router } from "express";
import {
  createGalleryItem,
  deleteGalleryItem,
  listAdminGallery,
  updateGalleryItem
} from "../controllers/adminGallery.controller.js";
import {
  getAdminPage,
  getAdminSettings,
  updateAdminPage,
  updateAdminSettings,
  uploadEditorImage
} from "../controllers/adminContent.controller.js";
import {
  archiveContact,
  listContacts,
  listSupportTickets,
  updateContactStatus,
  updateSupportTicket,
  deleteSupportTicket
} from "../controllers/adminForm.controller.js";
import {
  createProject,
  deleteProject,
  deleteProjectGalleryImage,
  listAdminProjects,
  updateProject
} from "../controllers/adminProject.controller.js";
import {
  createService,
  deleteService,
  listAdminServices,
  updateService
} from "../controllers/adminService.controller.js";
import { loginAdmin } from "../controllers/auth.controller.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";
import { loginValidators } from "../validators/auth.validators.js";
import {
  galleryCreateValidators,
  galleryUpdateValidators
} from "../validators/adminGallery.validators.js";
import {
  serviceCreateValidators,
  serviceUpdateValidators
} from "../validators/adminService.validators.js";
import {
  contactStatusValidators,
  supportUpdateValidators
} from "../validators/adminForm.validators.js";
import {
  pageSlugParam,
  pageUpdateValidators,
  settingsUpdateValidators
} from "../validators/adminContent.validators.js";
import {
  mongoIdParam,
  imageIdParam,
  paginationValidators,
  projectCreateValidators,
  projectUpdateValidators
} from "../validators/adminProject.validators.js";

export const adminRoutes = Router();

adminRoutes.post("/auth/login", loginRateLimiter, loginValidators, validate, loginAdmin);

adminRoutes.use(authenticateAdmin);

adminRoutes
  .route("/projects")
  .get(paginationValidators, validate, listAdminProjects)
  .post(
    authorizeRoles("superadmin", "admin", "editor"),
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "galleryImages", maxCount: 10 }
    ]),
    projectCreateValidators,
    validate,
    createProject
  );

adminRoutes
  .route("/projects/:id")
  .put(
    authorizeRoles("superadmin", "admin", "editor"),
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "galleryImages", maxCount: 10 }
    ]),
    projectUpdateValidators,
    validate,
    updateProject
  )
  .delete(
    authorizeRoles("superadmin", "admin"),
    mongoIdParam,
    validate,
    deleteProject
  );

adminRoutes.delete(
  "/projects/:id/gallery/:imageId",
  authorizeRoles("superadmin", "admin", "editor"),
  mongoIdParam,
  imageIdParam,
  validate,
  deleteProjectGalleryImage
);

adminRoutes
  .route("/gallery")
  .get(paginationValidators, validate, listAdminGallery)
  .post(
    authorizeRoles("superadmin", "admin", "editor"),
    upload.single("image"),
    galleryCreateValidators,
    validate,
    createGalleryItem
  );

adminRoutes
  .route("/gallery/:id")
  .put(
    authorizeRoles("superadmin", "admin", "editor"),
    upload.single("image"),
    galleryUpdateValidators,
    validate,
    updateGalleryItem
  )
  .delete(
    authorizeRoles("superadmin", "admin"),
    mongoIdParam,
    validate,
    deleteGalleryItem
  );

adminRoutes
  .route("/services")
  .get(paginationValidators, validate, listAdminServices)
  .post(
    authorizeRoles("superadmin", "admin", "editor"),
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "icon", maxCount: 1 }
    ]),
    serviceCreateValidators,
    validate,
    createService
  );

adminRoutes
  .route("/services/:id")
  .put(
    authorizeRoles("superadmin", "admin", "editor"),
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "icon", maxCount: 1 }
    ]),
    serviceUpdateValidators,
    validate,
    updateService
  )
  .delete(
    authorizeRoles("superadmin", "admin"),
    mongoIdParam,
    validate,
    deleteService
  );

adminRoutes.get("/contacts", paginationValidators, validate, listContacts);
adminRoutes.put(
  "/contacts/:id",
  authorizeRoles("superadmin", "admin", "editor"),
  contactStatusValidators,
  validate,
  updateContactStatus
);
adminRoutes.delete(
  "/contacts/:id",
  authorizeRoles("superadmin", "admin"),
  mongoIdParam,
  validate,
  archiveContact
);

adminRoutes.get("/support", paginationValidators, validate, listSupportTickets);
adminRoutes.put(
  "/support/:id",
  authorizeRoles("superadmin", "admin", "editor"),
  supportUpdateValidators,
  validate,
  updateSupportTicket
);
adminRoutes.delete(
  "/support/:id",
  authorizeRoles("superadmin", "admin"),
  mongoIdParam,
  validate,
  deleteSupportTicket
);

adminRoutes.get("/pages/:slug", pageSlugParam, validate, getAdminPage);
adminRoutes.put(
  "/pages/:slug",
  authorizeRoles("superadmin", "admin", "editor"),
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "planningImage", maxCount: 1 },
    { name: "whyImage", maxCount: 1 },
    { name: "workflowImage", maxCount: 1 }
  ]),
  pageUpdateValidators,
  validate,
  updateAdminPage
);

adminRoutes.post(
  "/uploads/editor-image",
  authorizeRoles("superadmin", "admin", "editor"),
  upload.single("upload"),
  uploadEditorImage
);

adminRoutes.get("/settings", getAdminSettings);
adminRoutes.put(
  "/settings",
  authorizeRoles("superadmin", "admin"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 }
  ]),
  settingsUpdateValidators,
  validate,
  updateAdminSettings
);
