import mongoose from "mongoose";
import { ImageSchema } from "./shared/image.schema.js";

const pageContentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    heroImage: ImageSchema,
    sectionImages: {
      planning: ImageSchema,
      why: ImageSchema,
      workflow: ImageSchema
    },
    seoTitle: String,
    seoDescription: String,
    status: { type: String, enum: ["published", "draft"], default: "draft", index: true }
  },
  { timestamps: true }
);

export const PageContent = mongoose.model("PageContent", pageContentSchema);
