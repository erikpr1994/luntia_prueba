import { Router, Request, Response } from "express";
import { upload } from "../middleware";
import { VolunteerService } from "../services/volunteerService";

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
      const volunteerService = new VolunteerService();
      const result = await volunteerService.processCSV(csvData);

      res.json({ ...result });
    } catch (error) {
      console.error("Error processing volunteers CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

// Data retrieval
router.get("/", async (req: Request, res: Response) => {
  try {
    const volunteerService = new VolunteerService();
    const filters = {
      active: req.query.active ? req.query.active === "true" : undefined,
      organization: req.query.organization as string,
    };
    const volunteers = await volunteerService.getAll(filters);
    res.json({ data: volunteers });
  } catch (error) {
    console.error("Error getting volunteers:", error);
    res.status(500).json({ error: "Failed to get volunteers" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const volunteerService = new VolunteerService();
    const volunteer = await volunteerService.getById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    res.json({ data: volunteer });
  } catch (error) {
    console.error("Error getting volunteer:", error);
    res.status(500).json({ error: "Failed to get volunteer" });
  }
});

router.get(
  "/organization/:organization",
  async (req: Request, res: Response) => {
    try {
      const volunteerService = new VolunteerService();
      const volunteers = await volunteerService.getByOrganization(
        req.params.organization
      );
      res.json({ data: volunteers });
    } catch (error) {
      console.error("Error getting volunteers by organization:", error);
      res.status(500).json({ error: "Failed to get volunteers" });
    }
  }
);

export default router;
