import cors from "cors";
import { env } from "./env.js";

const allowedOrigins = new Set([
  env.publicFrontendUrl,
  env.adminFrontendUrl,
  "https://tanuenterprise.vercel.app",
  "https://tanushree-infrastructure.vercel.app"
].filter(Boolean));

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true
});
