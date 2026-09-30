import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { failure, success } from "../utils/apiResponse.js";

function signAccessToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), role: admin.role },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpires }
  );
}

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email).toLowerCase();

  if (env.nodeEnv !== "production") {
    console.log(`[admin-login] attempt email=${normalizedEmail}`);
  }

  const admin = await Admin.findOne({ email: normalizedEmail, status: "active" })
    .select("+passwordHash");

  if (!admin) {
    if (env.nodeEnv !== "production") {
      console.log(`[admin-login] failed email=${normalizedEmail} reason=admin_not_found_or_inactive`);
    }
    return failure(res, "Invalid email or password", [], 401);
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatches) {
    if (env.nodeEnv !== "production") {
      console.log(`[admin-login] failed email=${normalizedEmail} reason=password_mismatch adminId=${admin._id}`);
    }
    return failure(res, "Invalid email or password", [], 401);
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAccessToken(admin);

  if (env.nodeEnv !== "production") {
    console.log(`[admin-login] success email=${normalizedEmail} adminId=${admin._id}`);
  }

  success(res, "Login successful", {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});
