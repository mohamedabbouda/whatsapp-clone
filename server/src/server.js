import { createServer } from "http";
import { Server } from "socket.io";

import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { registerSocketHandlers } from "./services/socket.service.js";

export const startServer = () => {
  const app = createApp();
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  registerSocketHandlers(io);

  httpServer.listen(env.port, () => {
    console.log(`Server started on port ${env.port}`);
    console.log(`Allowed client origin: ${env.clientUrl}`);
    console.log(`Environment: ${env.nodeEnv}`);
  });
};
