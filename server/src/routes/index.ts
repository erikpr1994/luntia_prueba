import { Router } from "express";
import healthRoutes from "./health";
import volunteerRoutes from "./volunteerRoutes";
import memberRoutes from "./memberRoutes";
import shiftRoutes from "./shiftRoutes";
import donationRoutes from "./donationRoutes";
import activityRoutes from "./activityRoutes";
import metricsRoutes from "./metricsRoutes";

const router: Router = Router();

// Mount route modules
router.use("/", healthRoutes);
router.use("/api/volunteers", volunteerRoutes);
router.use("/api/members", memberRoutes);
router.use("/api/shifts", shiftRoutes);
router.use("/api/donations", donationRoutes);
router.use("/api/activities", activityRoutes);
router.use("/api/metrics", metricsRoutes);

export default router;
