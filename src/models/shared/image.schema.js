import mongoose from "mongoose";

export const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, index: true },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    altText: { type: String, trim: true, default: "" }
  }
);
