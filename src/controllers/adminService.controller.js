import { Service } from "../models/Service.js";
import { storageService } from "../services/storage/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { failure, success } from "../utils/apiResponse.js";
import { buildMeta, getPagination } from "../utils/pagination.js";
import { getAdminSort } from "../utils/sort.js";

function servicePayload(body) {
  const allowed = [
    "title",
    "slug",
    "shortDescription",
    "description",
    "featured",
    "status",
    "sortOrder",
    "seoTitle",
    "seoDescription"
  ];

  return allowed.reduce((payload, key) => {
    if (body[key] !== undefined) payload[key] = body[key];
    return payload;
  }, {});
}

async function deleteServiceImages(service) {
  const publicIds = [service.image?.publicId, service.icon?.publicId].filter(Boolean);
  await Promise.all(publicIds.map((publicId) => storageService.deleteImage(publicId)));
}

export const listAdminServices = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { deletedAt: null };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) filter.$text = { $search: req.query.search };
  const sort = getAdminSort(req.query, { sortOrder: 1, createdAt: -1 });

  const [items, total] = await Promise.all([
    Service.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Service.countDocuments(filter)
  ]);

  success(res, "Services fetched successfully", items, buildMeta(page, limit, total));
});

export const createService = asyncHandler(async (req, res) => {
  const payload = servicePayload(req.body);

  if (req.files?.image?.[0]) {
    payload.image = await storageService.uploadImage(req.files.image[0], {
      folderKey: "services",
      altText: req.body.imageAltText || req.body.title,
      tags: ["service-image"]
    });
  }

  if (req.files?.icon?.[0]) {
    payload.icon = await storageService.uploadImage(req.files.icon[0], {
      folderKey: "services",
      altText: req.body.iconAltText || req.body.title,
      tags: ["service-icon"]
    });
  }

  const service = await Service.create(payload);
  success(res, "Service created successfully", service, undefined, 201);
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, deletedAt: null });
  if (!service) return failure(res, "Service not found", [], 404);

  Object.assign(service, servicePayload(req.body));

  if (req.files?.image?.[0]) {
    service.image = await storageService.replaceImage(service.image, req.files.image[0], {
      folderKey: "services",
      altText: req.body.imageAltText || service.title,
      tags: ["service-image"]
    });
  }

  if (req.files?.icon?.[0]) {
    service.icon = await storageService.replaceImage(service.icon, req.files.icon[0], {
      folderKey: "services",
      altText: req.body.iconAltText || service.title,
      tags: ["service-icon"]
    });
  }

  await service.save();
  success(res, "Service updated successfully", service);
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, deletedAt: null });
  if (!service) return failure(res, "Service not found", [], 404);

  await deleteServiceImages(service);
  service.deletedAt = new Date();
  service.image = undefined;
  service.icon = undefined;
  await service.save();

  success(res, "Service deleted successfully");
});
