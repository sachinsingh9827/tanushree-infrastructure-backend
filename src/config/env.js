import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, "../../../.env") });
dotenv.config({ path: resolve(currentDir, "../../.env"), override: true });

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tanuenterprise",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",
  publicFrontendUrl: process.env.PUBLIC_FRONTEND_URL || "http://localhost:5173",
  adminFrontendUrl: process.env.ADMIN_FRONTEND_URL || "http://localhost:5174",
  uploadProvider: process.env.UPLOAD_PROVIDER || "cloudinary",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    rootFolder: process.env.CLOUDINARY_ROOT_FOLDER || "tanuenterprise"
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    mailFrom: process.env.MAIL_FROM,
    adminEmail: process.env.ADMIN_EMAIL
  },
  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL,
    adminPassword: process.env.SEED_ADMIN_PASSWORD
  }
};

export function requireEnv(name, value) {
  if (!value) {
    throw new Error(`${name} is required`);
  }
}
