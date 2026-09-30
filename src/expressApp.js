import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { corsMiddleware } from "./config/cors.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { publicRoutes } from "./routes/public.routes.js";

export function configureApp(app, express) {
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(corsMiddleware);
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(mongoSanitize());
  app.use(hpp());

  if (env.nodeEnv !== "test") {
    app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  }

  app.get("/", (_req, res) => {
    res.json({ success: true, message: "Tanushree Infrastructure API is running", health: "/api/health" });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "API is healthy" });
  });

  app.use("/api", publicRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFound);
  app.use(errorHandler);
}
