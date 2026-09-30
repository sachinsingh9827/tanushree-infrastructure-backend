import express from "express";
import { connectDatabase } from "./config/database.js";
import { env, requireEnv } from "./config/env.js";
import { configureApp } from "./expressApp.js";

const app = express();
configureApp(app, express);

async function bootstrap() {
  requireEnv("JWT_ACCESS_SECRET", env.jwtAccessSecret);
  console.log("Connecting to MongoDB");
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`Tanushree Infrastructure API running on port ${env.port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${env.port} is already in use. Stop the existing process or set PORT to another value.`);
      process.exit(1);
    }

    throw error;
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
