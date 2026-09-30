import { env } from "../../../config/env.js";

export const cloudinaryFolders = Object.freeze({
  projects: "projects",
  projectGallery: "projects/gallery",
  services: "services",
  gallery: "gallery",
  pages: "pages",
  editor: "editor",
  settings: "settings",
  logos: "settings/logo",
  banners: "banners",
  seo: "seo"
});

export function getCloudinaryFolder(folderKey) {
  const moduleFolder = cloudinaryFolders[folderKey];
  if (!moduleFolder) {
    throw new Error(`Unknown Cloudinary folder key: ${folderKey}`);
  }

  return `${env.cloudinary.rootFolder}/${moduleFolder}`;
}
