import { Router, Request, Response } from "express";
import { MetricsService } from "../services/metricsService";

const router: Router = Router();

// Basic metrics (legacy - for backward compatibility)
router.get("/", async (req: Request, res: Response) => {
  try {
    const metricsService = new MetricsService();
    const metrics = await metricsService.getBasicMetrics();
    res.json({ metrics });
  } catch (error) {
    console.error("Error getting metrics:", error);
    res.status(500).json({ error: "Failed to get metrics" });
  }
});

// Engagement metrics
router.get("/engagement", async (req: Request, res: Response) => {
  try {
    const metricsService = new MetricsService();
    const organization = req.query.organization as string;
    const metrics = await metricsService.getEngagementMetrics(organization);
    res.json({ metrics });
  } catch (error) {
    console.error("Error getting engagement metrics:", error);
    res.status(500).json({ error: "Failed to get engagement metrics" });
  }
});

// Impact metrics
router.get("/impact", async (req: Request, res: Response) => {
  try {
    const metricsService = new MetricsService();
    const organization = req.query.organization as string;
    const metrics = await metricsService.getImpactMetrics(organization);
    res.json({ metrics });
  } catch (error) {
    console.error("Error getting impact metrics:", error);
    res.status(500).json({ error: "Failed to get impact metrics" });
  }
});

// Health metrics
router.get("/health", async (req: Request, res: Response) => {
  try {
    const metricsService = new MetricsService();
    const organization = req.query.organization as string;
    const metrics = await metricsService.getHealthMetrics(organization);
    res.json({ metrics });
  } catch (error) {
    console.error("Error getting health metrics:", error);
    res.status(500).json({ error: "Failed to get health metrics" });
  }
});

// Comprehensive dashboard metrics
router.get("/dashboard", async (req: Request, res: Response) => {
  try {
    const metricsService = new MetricsService();
    const organization = req.query.organization as string;

    const [engagement, impact, health] = await Promise.all([
      metricsService.getEngagementMetrics(organization),
      metricsService.getImpactMetrics(organization),
      metricsService.getHealthMetrics(organization),
    ]);

    res.json({
      engagement,
      impact,
      health,
      organization: organization || "all",
    });
  } catch (error) {
    console.error("Error getting dashboard metrics:", error);
    res.status(500).json({ error: "Failed to get dashboard metrics" });
  }
});

// Organization-specific metrics (legacy)
router.get(
  "/organization/:organization",
  async (req: Request, res: Response) => {
    try {
      const metricsService = new MetricsService();
      const metrics = await metricsService.getOrganizationMetrics(
        req.params.organization
      );
      res.json({ metrics });
    } catch (error) {
      console.error("Error getting organization metrics:", error);
      res.status(500).json({ error: "Failed to get metrics" });
    }
  }
);

// Overall stats (legacy)
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const metricsService = new MetricsService();
    const stats = await metricsService.getOverallStats();
    res.json({ stats });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

// Daily volunteer activity for charts
router.get("/daily-activity", async (req: Request, res: Response) => {
  try {
    const metricsService = new MetricsService();
    const days = parseInt(req.query.days as string) || 30;
    const organization = req.query.organization as string;
    const activity = await metricsService.getDailyVolunteerActivity(days, organization);
    res.json({ activity });
  } catch (error) {
    console.error("Error getting daily activity:", error);
    res.status(500).json({ error: "Failed to get daily activity" });
  }
});

export default router;
