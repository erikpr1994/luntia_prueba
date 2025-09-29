import express from "express";
import { setupMiddleware } from "../middleware";
import routes from "../routes";
import { initDatabase } from "../database/connection";

export const createApp = (): express.Application => {
  const app = express();

  // Setup middleware
  setupMiddleware(app);

  // Setup routes
  app.use("/", routes);

  // Initialize database on startup
  initDatabase().catch(console.error);

  return app;
};

export const startServer = (app: express.Application, port: number = 3000) => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
