import mongoose from "mongoose";
import { ImageSchema } from "./shared/image.schema.js";

const siteSettingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: "site-settings", unique: true },
    companyName: { type: String, default: "Tanushree Infrastructure" },
    logo: ImageSchema,
    favicon: ImageSchema,
    email: String,
    phone: String,
    alternatePhone: String,
    address: String,
    googleMapUrl: String,
    facebook: String,
    instagram: String,
    linkedin: String,
    youtube: String,
    whatsapp: String,
    footerText: String
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
