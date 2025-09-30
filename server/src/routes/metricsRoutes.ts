import { Router, Request, Response } from "express";
import { MetricsService } from "../services/metricsService";

const router: Router = Router();

// Basic metrics
router.get("/", async (req: Request, res: Response) => {
  try {
    const metricsService = new MetricsService();
    const metrics = await metricsService.getBasicMetrics();
    res.json({ success: true, metrics });
  } catch (error) {
    console.error("Error getting metrics:", error);
    res.status(500).json({ error: "Failed to get metrics" });
  }
});

// Organization-specific metrics
router.get(
  "/organization/:organization",
  async (req: Request, res: Response) => {
    try {
      const metricsService = new MetricsService();
      const metrics = await metricsService.getOrganizationMetrics(
        req.params.organization
      );
      res.json({ success: true, metrics });
    } catch (error) {
      console.error("Error getting organization metrics:", error);
      res.status(500).json({ error: "Failed to get metrics" });
    }
  }
);

// Overall stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const metricsService = new MetricsService();
    const stats = await metricsService.getOverallStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
