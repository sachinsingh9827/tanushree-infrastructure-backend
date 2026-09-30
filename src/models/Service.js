import mongoose from "mongoose";
import slugify from "slugify";
import { ImageSchema } from "./shared/image.schema.js";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    description: { type: String, default: "" },
    image: ImageSchema,
    icon: ImageSchema,
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
    sortOrder: { type: Number, default: 0, index: true },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

serviceSchema.pre("validate", function createSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

serviceSchema.index({ title: "text", shortDescription: "text" });

export const Service = mongoose.model("Service", serviceSchema);
