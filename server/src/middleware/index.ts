import express from "express";
import multer from "multer";
import cors from "cors";

// Configure multer for file uploads
export const upload = multer({ storage: multer.memoryStorage() });

// Middleware setup
export const setupMiddleware = (app: express.Application) => {
  // Enable CORS for frontend communication
  app.use(
    cors({
      origin: "http://localhost:3001",
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
