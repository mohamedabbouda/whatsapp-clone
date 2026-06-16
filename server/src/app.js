import express from "express";
import cors from "cors";
import { mkdirSync } from "fs";

import AuthRoutes from "./modules/auth/auth.routes.js";
import MessageRoutes from "./modules/messages/message.routes.js";
import { env } from "./config/env.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import {
  apiRateLimiter,
  helmetMiddleware,
} from "./middlewares/security.middleware.js";

export const createApp = () => {
  const app = express();

  mkdirSync("uploads/temp", { recursive: true });
  mkdirSync("uploads/recordings", { recursive: true });
  mkdirSync("uploads/images", { recursive: true });
  mkdirSync("uploads/profile-pictures", { recursive: true });

  app.use(helmetMiddleware);

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.use("/uploads/recordings", express.static("uploads/recordings"));
  app.use("/uploads/images", express.static("uploads/images"));
  app.use(
    "/uploads/profile-pictures",
    express.static("uploads/profile-pictures")
  );

  app.get("/health", (req, res) => {
    return res.status(200).json({
      status: "ok",
      service: "chatlosss-api",
      environment: env.nodeEnv,
    });
  });

  app.use("/api", apiRateLimiter);
  app.use("/api/auth", AuthRoutes);
  app.use("/api/messages", MessageRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
