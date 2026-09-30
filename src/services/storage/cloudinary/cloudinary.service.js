import { Readable } from "node:stream";
import { configureCloudinary } from "./cloudinary.config.js";
import { getCloudinaryFolder } from "./cloudinary.folders.js";

const IMAGE_TRANSFORMATION = [
  { quality: "auto:good", fetch_format: "auto" }
];

function uploadBuffer(buffer, options) {
  const cloudinary = configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });

    Readable.from(buffer).pipe(stream);
  });
}

export async function uploadImage(file, { folderKey, altText = "", tags = [] }) {
  if (!file?.buffer) {
    throw new Error("Image file is required");
  }

  const result = await uploadBuffer(file.buffer, {
    folder: getCloudinaryFolder(folderKey),
    resource_type: "image",
    transformation: IMAGE_TRANSFORMATION,
    tags
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
    altText
  };
}

export async function deleteImage(publicId) {
  if (!publicId) return null;
  const cloudinary = configureCloudinary();
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export async function replaceImage(existingImage, file, options) {
  const nextImage = await uploadImage(file, options);

  if (existingImage?.publicId) {
    await deleteImage(existingImage.publicId);
  }

  return nextImage;
}

export function buildResponsiveImageUrl(publicId, { width = 1200, height, crop = "limit" } = {}) {
  if (!publicId) return "";
  const cloudinary = configureCloudinary();
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width,
        ...(height ? { height } : {}),
        crop,
        quality: "auto:good",
        fetch_format: "auto"
      }
    ]
  });
}
