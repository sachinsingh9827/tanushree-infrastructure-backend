import { v2 as cloudinary } from "cloudinary";
import { env, requireEnv } from "../../../config/env.js";

let configured = false;

export function configureCloudinary() {
  if (configured) return cloudinary;

  requireEnv("CLOUDINARY_CLOUD_NAME", env.cloudinary.cloudName);
  requireEnv("CLOUDINARY_API_KEY", env.cloudinary.apiKey);
  requireEnv("CLOUDINARY_API_SECRET", env.cloudinary.apiSecret);

  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true
  });

  configured = true;
  return cloudinary;
}
