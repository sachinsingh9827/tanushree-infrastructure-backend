import mongoose from "mongoose";
import { ImageSchema } from "./shared/image.schema.js";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    image: { type: ImageSchema, required: true },
    caption: { type: String, trim: true, maxlength: 300 },
    category: { type: String, trim: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
      index: true
    },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

gallerySchema.index({ status: 1, sortOrder: 1, createdAt: -1 });
gallerySchema.index({ title: "text", caption: "text", category: "text" });

export const Gallery = mongoose.model("Gallery", gallerySchema);
