import {
  buildResponsiveImageUrl,
  deleteImage,
  replaceImage,
  uploadImage
} from "./cloudinary/cloudinary.service.js";

export const storageService = {
  uploadImage,
  replaceImage,
  deleteImage,
  buildResponsiveImageUrl
};
