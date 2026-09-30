import { Project } from "../models/Project.js";
import { storageService } from "../services/storage/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { failure, success } from "../utils/apiResponse.js";
import { buildMeta, getPagination } from "../utils/pagination.js";
import { getAdminSort } from "../utils/sort.js";

function projectPayload(body) {
  const allowed = [
    "title",
    "slug",
    "shortDescription",
    "description",
    "location",
    "category",
    "status",
    "client",
    "startDate",
    "completionDate",
    "featured",
    "published",
    "seoTitle",
    "seoDescription",
    "sortOrder"
  ];

  return allowed.reduce((payload, key) => {
    if (body[key] !== undefined) payload[key] = body[key];
    return payload;
  }, {});
}

async function deleteProjectImages(project) {
  const publicIds = [
    project.coverImage?.publicId,
    ...(project.galleryImages || []).map((image) => image.publicId)
  ].filter(Boolean);

  await Promise.all(publicIds.map((publicId) => storageService.deleteImage(publicId)));
}

export const listAdminProjects = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { deletedAt: null };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.published !== undefined) filter.published = req.query.published === "true";
  if (req.query.search) filter.$text = { $search: req.query.search };
  const sort = getAdminSort(req.query, { sortOrder: 1, createdAt: -1 });

  const [items, total] = await Promise.all([
    Project.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Project.countDocuments(filter)
  ]);

  success(res, "Projects fetched successfully", items, buildMeta(page, limit, total));
});

export const createProject = asyncHandler(async (req, res) => {
  const payload = projectPayload(req.body);

  if (req.files?.coverImage?.[0]) {
    payload.coverImage = await storageService.uploadImage(req.files.coverImage[0], {
      folderKey: "projects",
      altText: req.body.coverAltText || req.body.title,
      tags: ["project-cover"]
    });
  }

  if (req.files?.galleryImages?.length) {
    payload.galleryImages = await Promise.all(
      req.files.galleryImages.map((file) =>
        storageService.uploadImage(file, {
          folderKey: "projectGallery",
          altText: req.body.title,
          tags: ["project-gallery"]
        })
      )
    );
  }

  const project = await Project.create(payload);
  success(res, "Project created successfully", project, undefined, 201);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, deletedAt: null });
  if (!project) return failure(res, "Project not found", [], 404);

  Object.assign(project, projectPayload(req.body));

  if (req.files?.coverImage?.[0]) {
    project.coverImage = await storageService.replaceImage(project.coverImage, req.files.coverImage[0], {
      folderKey: "projects",
      altText: req.body.coverAltText || project.title,
      tags: ["project-cover"]
    });
  }

  if (req.files?.galleryImages?.length) {
    const uploaded = await Promise.all(
      req.files.galleryImages.map((file) =>
        storageService.uploadImage(file, {
          folderKey: "projectGallery",
          altText: project.title,
          tags: ["project-gallery"]
        })
      )
    );
    project.galleryImages.push(...uploaded);
  }

  await project.save();
  success(res, "Project updated successfully", project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, deletedAt: null });
  if (!project) return failure(res, "Project not found", [], 404);

  await deleteProjectImages(project);
  project.deletedAt = new Date();
  project.coverImage = undefined;
  project.galleryImages = [];
  await project.save();

  success(res, "Project deleted successfully");
});

export const deleteProjectGalleryImage = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, deletedAt: null });
  if (!project) return failure(res, "Project not found", [], 404);

  const image = project.galleryImages.id(req.params.imageId);
  if (!image) return failure(res, "Project gallery image not found", [], 404);

  await storageService.deleteImage(image.publicId);
  image.deleteOne();
  await project.save();

  success(res, "Project gallery image deleted successfully", project);
});
