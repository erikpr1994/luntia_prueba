import { Router, Request, Response } from "express";
import { upload } from "../middleware";
import { CSVService } from "../services/csvService";

const router: Router = Router();

// Health check routes
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "CSV Processing API Server" });
});

router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// CSV upload routes
router.post(
  "/api/upload/volunteers",
  upload.single("csv"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file provided" });
      }

      const csvData = req.file.buffer.toString("utf-8");
      const csvService = new CSVService();
      const result = await csvService.processVolunteers(csvData);

      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Error processing volunteers CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

router.post(
  "/api/upload/members",
  upload.single("csv"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file provided" });
      }

      const csvData = req.file.buffer.toString("utf-8");
      const csvService = new CSVService();
      const result = await csvService.processMembers(csvData);

      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Error processing members CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

router.post(
  "/api/upload/shifts",
  upload.single("csv"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file provided" });
      }

      const csvData = req.file.buffer.toString("utf-8");
      const csvService = new CSVService();
      const result = await csvService.processShifts(csvData);

      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Error processing shifts CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

router.post(
  "/api/upload/donations",
  upload.single("csv"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file provided" });
      }

      const csvData = req.file.buffer.toString("utf-8");
      const csvService = new CSVService();
      const result = await csvService.processDonations(csvData);

      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Error processing donations CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

router.post(
  "/api/upload/activities",
  upload.single("csv"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file provided" });
      }

      const csvData = req.file.buffer.toString("utf-8");
      const csvService = new CSVService();
      const result = await csvService.processActivities(csvData);

      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Error processing activities CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

export default router;
