import { Router, Request, Response } from "express";

const router: Router = Router();

// Health check routes
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "CSV Processing API Server" });
});

router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default router;
