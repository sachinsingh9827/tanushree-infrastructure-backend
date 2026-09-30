import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";
import { failure } from "../utils/apiResponse.js";

export async function authenticateAdmin(req, res, next) {
  try {
    const header = req.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return failure(res, "Authentication required", [], 401);
    }

    const payload = jwt.verify(token, env.jwtAccessSecret);
    const admin = await Admin.findOne({ _id: payload.sub, status: "active" }).lean();

    if (!admin) {
      return failure(res, "Invalid authentication token", [], 401);
    }

    req.admin = admin;
    next();
  } catch (_error) {
    failure(res, "Invalid authentication token", [], 401);
  }
}
