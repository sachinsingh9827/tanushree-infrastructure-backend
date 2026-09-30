import { Gallery } from "../models/Gallery.js";
import { storageService } from "../services/storage/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { failure, success } from "../utils/apiResponse.js";
import { buildMeta, getPagination } from "../utils/pagination.js";
import { getAdminSort } from "../utils/sort.js";

function galleryPayload(body) {
  const allowed = ["title", "caption", "category", "sortOrder", "status"];
  return allowed.reduce((payload, key) => {
    if (body[key] !== undefined) payload[key] = body[key];
    return payload;
  }, {});
}

export const listAdminGallery = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { deletedAt: null };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.$text = { $search: req.query.search };
  const sort = getAdminSort(req.query, { sortOrder: 1, createdAt: -1 });

  const [items, total] = await Promise.all([
    Gallery.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Gallery.countDocuments(filter)
  ]);

  success(res, "Gallery images fetched successfully", items, buildMeta(page, limit, total));
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  if (!req.file) return failure(res, "Image file is required", [], 422);

  const image = await storageService.uploadImage(req.file, {
    folderKey: "gallery",
    altText: req.body.altText || req.body.title,
    tags: ["gallery"]
  });

  const item = await Gallery.create({
    ...galleryPayload(req.body),
    image
  });

  success(res, "Gallery image created successfully", item, undefined, 201);
});

export const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findOne({ _id: req.params.id, deletedAt: null });
  if (!item) return failure(res, "Gallery image not found", [], 404);

  Object.assign(item, galleryPayload(req.body));

  if (req.file) {
    item.image = await storageService.replaceImage(item.image, req.file, {
      folderKey: "gallery",
      altText: req.body.altText || item.title,
      tags: ["gallery"]
    });
  }

  await item.save();
  success(res, "Gallery image updated successfully", item);
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findOne({ _id: req.params.id, deletedAt: null });
  if (!item) return failure(res, "Gallery image not found", [], 404);

  await storageService.deleteImage(item.image?.publicId);
  item.deletedAt = new Date();
  await item.save();

  success(res, "Gallery image deleted successfully");
});
