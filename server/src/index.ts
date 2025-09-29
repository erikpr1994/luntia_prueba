// Extend Request interface to include multer file property
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

import { createApp, startServer } from "./config/server";

const PORT = process.env.PORT || 3000;
const app = createApp();

startServer(app, Number(PORT));
