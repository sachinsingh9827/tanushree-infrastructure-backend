import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    customerType: {
      type: String,
      enum: ["Owner", "Builder", "Architect", "Contractor", "Business", "Other"],
      default: "Owner",
      index: true
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["New", "Read", "In Progress", "Resolved", "Spam"],
      default: "New",
      index: true
    },
    archivedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);
