import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["superadmin", "admin", "editor"], default: "admin" },
    status: { type: String, enum: ["active", "disabled"], default: "active", index: true },
    lastLoginAt: Date
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
