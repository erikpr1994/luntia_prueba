import { Router, Request, Response } from "express";
import { upload } from "../middleware";
import { ActivityService } from "../services/activityService";

const router: Router = Router();

// CSV upload
router.post(
  "/upload",
  upload.single("csv"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file provided" });
      }

      const csvData = req.file.buffer.toString("utf-8");
      const activityService = new ActivityService();
      const result = await activityService.processCSV(csvData);

      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Error processing activities CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

// Data retrieval
router.get("/", async (req: Request, res: Response) => {
  try {
    const activityService = new ActivityService();
    const filters = {
      organization: req.query.organization as string,
      date_from: req.query.date_from as string,
      date_to: req.query.date_to as string,
    };
    const activities = await activityService.getAll(filters);
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error("Error getting activities:", error);
    res.status(500).json({ error: "Failed to get activities" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const activityService = new ActivityService();
    const activity = await activityService.getById(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error("Error getting activity:", error);
    res.status(500).json({ error: "Failed to get activity" });
  }
});

router.get(
  "/organization/:organization",
  async (req: Request, res: Response) => {
    try {
      const activityService = new ActivityService();
      const activities = await activityService.getByOrganization(
        req.params.organization
      );
      res.json({ success: true, data: activities });
    } catch (error) {
      console.error("Error getting activities by organization:", error);
      res.status(500).json({ error: "Failed to get activities" });
    }
  }
);

router.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const activityService = new ActivityService();
    const activities = await activityService.getUpcoming();
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error("Error getting upcoming activities:", error);
    res.status(500).json({ error: "Failed to get activities" });
  }
});

export default router;
