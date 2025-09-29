import express from "express";
import multer from "multer";

// Configure multer for file uploads
export const upload = multer({ storage: multer.memoryStorage() });

// Middleware setup
export const setupMiddleware = (app: express.Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
