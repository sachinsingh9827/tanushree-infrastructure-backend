import mongoose from "mongoose";
import slugify from "slugify";
import { ImageSchema } from "./shared/image.schema.js";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    description: { type: String, default: "" },
    location: { type: String, trim: true },
    category: { type: String, trim: true, index: true },
    status: {
      type: String,
      enum: ["Completed", "Ongoing", "Upcoming"],
      default: "Upcoming",
      index: true
    },
    client: { type: String, trim: true },
    startDate: Date,
    completionDate: Date,
    coverImage: ImageSchema,
    galleryImages: { type: [ImageSchema], default: [] },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    sortOrder: { type: Number, default: 0, index: true },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

projectSchema.pre("validate", function createSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

projectSchema.index({ published: 1, sortOrder: 1, createdAt: -1 });
projectSchema.index({ title: "text", location: "text", category: "text" });

export const Project = mongoose.model("Project", projectSchema);
