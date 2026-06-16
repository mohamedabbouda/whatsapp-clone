import express from "express";
import cors from "cors";
import { mkdirSync } from "fs";

import AuthRoutes from "./modules/auth/auth.routes.js";
import MessageRoutes from "./modules/messages/message.routes.js";
import { env } from "./config/env.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const createApp = () => {
  const app = express();

  mkdirSync("uploads/recordings", { recursive: true });
  mkdirSync("uploads/images", { recursive: true });
  mkdirSync("uploads/profile-pictures", { recursive: true });

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

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

  app.use("/api/auth", AuthRoutes);
  app.use("/api/messages", MessageRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
