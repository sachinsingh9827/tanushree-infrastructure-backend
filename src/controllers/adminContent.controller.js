import { PageContent } from "../models/PageContent.js";
import { SiteSettings } from "../models/SiteSettings.js";
import { storageService } from "../services/storage/index.js";
import { sanitizeHtml } from "../services/content/sanitizeHtml.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { failure, success } from "../utils/apiResponse.js";

function settingsPayload(body) {
  const allowed = [
    "companyName",
    "email",
    "phone",
    "alternatePhone",
    "address",
    "googleMapUrl",
    "facebook",
    "instagram",
    "linkedin",
    "youtube",
    "whatsapp",
    "footerText"
  ];

  return allowed.reduce((payload, key) => {
    if (body[key] !== undefined) payload[key] = body[key];
    return payload;
  }, {});
}

const publicPageDefaults = {
  home: "Practical construction work with a CMS-ready website.",
  about: "About tanuenterprise",
  services: "Builder services for practical project delivery.",
  projects: "Portfolio projects across completed, ongoing and upcoming work.",
  gallery: "Project images and construction highlights.",
  contact: "Start your project conversation with our team."
};

export const getAdminPage = asyncHandler(async (req, res) => {
  const defaultTitle = publicPageDefaults[req.params.slug] || req.params.slug.replaceAll("-", " ");
  const isPublicPage = Boolean(publicPageDefaults[req.params.slug]);
  const page = await PageContent.findOneAndUpdate(
    { slug: req.params.slug },
    {
      $setOnInsert: {
        slug: req.params.slug,
        title: defaultTitle,
        content: "",
        status: isPublicPage ? "published" : "draft"
      }
    },
    { upsert: true, new: true }
  ).lean();

  success(res, "Page content fetched successfully", page);
});

export const updateAdminPage = asyncHandler(async (req, res) => {
  const isPublicPage = Boolean(publicPageDefaults[req.params.slug]);
  const existing = await PageContent.findOne({ slug: req.params.slug }).lean();
  const payload = {
    title: req.body.title,
    content: sanitizeHtml(req.body.content || ""),
    seoTitle: req.body.seoTitle,
    seoDescription: req.body.seoDescription,
    status: req.body.status || (isPublicPage ? "published" : "draft")
  };

  if (req.file || req.files?.heroImage?.[0]) {
    const heroImageFile = req.file || req.files.heroImage[0];
    payload.heroImage = await storageService.replaceImage(existing?.heroImage, heroImageFile, {
      folderKey: "pages",
      altText: req.body.title,
      tags: ["page-hero", req.params.slug]
    });
  }

  const sectionImages = { ...(existing?.sectionImages || {}) };

  if (req.files?.planningImage?.[0]) {
    sectionImages.planning = await storageService.replaceImage(sectionImages.planning, req.files.planningImage[0], {
      folderKey: "pages",
      altText: `${req.body.title || req.params.slug} planning section`,
      tags: ["page-section", "planning", req.params.slug]
    });
  }

  if (req.files?.whyImage?.[0]) {
    sectionImages.why = await storageService.replaceImage(sectionImages.why, req.files.whyImage[0], {
      folderKey: "pages",
      altText: `${req.body.title || req.params.slug} why choose us section`,
      tags: ["page-section", "why-choose-us", req.params.slug]
    });
  }

  if (req.files?.workflowImage?.[0]) {
    sectionImages.workflow = await storageService.replaceImage(sectionImages.workflow, req.files.workflowImage[0], {
      folderKey: "pages",
      altText: `${req.body.title || req.params.slug} workflow section`,
      tags: ["page-section", "workflow", req.params.slug]
    });
  }

  if (sectionImages.planning || sectionImages.why || sectionImages.workflow) {
    payload.sectionImages = sectionImages;
  }

  const page = await PageContent.findOneAndUpdate(
    { slug: req.params.slug },
    { $set: payload, $setOnInsert: { slug: req.params.slug } },
    { upsert: true, new: true }
  );

  success(res, "Page content updated successfully", page);
});

export const uploadEditorImage = asyncHandler(async (req, res) => {
  if (!req.file) return failure(res, "Image file is required", [], 422);

  const image = await storageService.uploadImage(req.file, {
    folderKey: "editor",
    altText: req.body.altText || req.file.originalname,
    tags: ["editor-content"]
  });

  success(res, "Editor image uploaded successfully", { image });
});

export const getAdminSettings = asyncHandler(async (_req, res) => {
  const settings = await SiteSettings.findOneAndUpdate(
    { singletonKey: "site-settings" },
    { $setOnInsert: { singletonKey: "site-settings", companyName: "tanuenterprise" } },
    { upsert: true, new: true }
  ).lean();

  success(res, "Site settings fetched successfully", settings);
});

export const updateAdminSettings = asyncHandler(async (req, res) => {
  const existing = await SiteSettings.findOne({ singletonKey: "site-settings" }).lean();
  const payload = settingsPayload(req.body);

  if (req.files?.logo?.[0]) {
    payload.logo = await storageService.replaceImage(existing?.logo, req.files.logo[0], {
      folderKey: "logos",
      altText: req.body.companyName || existing?.companyName || "Logo",
      tags: ["site-logo"]
    });
  }

  if (req.files?.favicon?.[0]) {
    payload.favicon = await storageService.replaceImage(existing?.favicon, req.files.favicon[0], {
      folderKey: "settings",
      altText: "Favicon",
      tags: ["favicon"]
    });
  }

  const settings = await SiteSettings.findOneAndUpdate(
    { singletonKey: "site-settings" },
    { $set: payload, $setOnInsert: { singletonKey: "site-settings" } },
    { upsert: true, new: true }
  );

  success(res, "Site settings updated successfully", settings);
});
