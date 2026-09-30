import { Gallery } from "../models/Gallery.js";
import { PageContent } from "../models/PageContent.js";
import { Project } from "../models/Project.js";
import { Service } from "../models/Service.js";
import { SiteSettings } from "../models/SiteSettings.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { buildMeta, getPagination } from "../utils/pagination.js";

export const getHome = asyncHandler(async (_req, res) => {
  const [settings, services, projects, gallery] = await Promise.all([
    SiteSettings.findOne({ singletonKey: "site-settings" }).lean(),
    Service.find({ status: "active", deletedAt: null }).sort({ sortOrder: 1 }).limit(6).lean(),
    Project.find({ published: true, featured: true, deletedAt: null }).sort({ sortOrder: 1 }).limit(6).lean(),
    Gallery.find({ status: "published", deletedAt: null }).sort({ sortOrder: 1 }).limit(8).lean()
  ]);

  success(res, "Home content fetched successfully", { settings, services, projects, gallery });
});

export const getPublicPage = asyncHandler(async (req, res) => {
  const page = await PageContent.findOne({
    slug: req.params.slug,
    status: "published"
  })
    .select("slug title content heroImage sectionImages seoTitle seoDescription updatedAt")
    .lean();

  success(res, "Page content fetched successfully", page);
});

export const getPublicProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { published: true, deletedAt: null };
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    Project.find(filter)
      .select("title slug shortDescription location category status coverImage featured sortOrder")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter)
  ]);

  success(res, "Projects fetched successfully", items, buildMeta(page, limit, total));
});

export const getPublicProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug,
    published: true,
    deletedAt: null
  }).lean();

  success(res, "Project fetched successfully", project);
});

export const getPublicServices = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { status: "active", deletedAt: null };

  const [items, total] = await Promise.all([
    Service.find(filter)
      .select("title slug shortDescription image icon featured sortOrder")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Service.countDocuments(filter)
  ]);

  success(res, "Services fetched successfully", items, buildMeta(page, limit, total));
});

export const getPublicGallery = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { status: "published", deletedAt: null };
  if (req.query.category) filter.category = req.query.category;

  const [items, total] = await Promise.all([
    Gallery.find(filter)
      .select("title caption category image sortOrder createdAt")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Gallery.countDocuments(filter)
  ]);

  success(res, "Gallery fetched successfully", items, buildMeta(page, limit, total));
});
