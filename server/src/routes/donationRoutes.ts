import { Router, Request, Response } from "express";
import { upload } from "../middleware";
import { DonationService } from "../services/donationService";

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
      const donationService = new DonationService();
      const result = await donationService.processCSV(csvData);

      res.json({ ...result });
    } catch (error) {
      console.error("Error processing donations CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

// Data retrieval
router.get("/", async (req: Request, res: Response) => {
  try {
    const donationService = new DonationService();
    const filters = {
      organization: req.query.organization as string,
      date_from: req.query.date_from as string,
      date_to: req.query.date_to as string,
    };
    const donations = await donationService.getAll(filters);
    res.json({ data: donations });
  } catch (error) {
    console.error("Error getting donations:", error);
    res.status(500).json({ error: "Failed to get donations" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const donationService = new DonationService();
    const donation = await donationService.getById(req.params.id);

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.json({ data: donation });
  } catch (error) {
    console.error("Error getting donation:", error);
    res.status(500).json({ error: "Failed to get donation" });
  }
});

router.get(
  "/organization/:organization",
  async (req: Request, res: Response) => {
    try {
      const donationService = new DonationService();
      const donations = await donationService.getByOrganization(
        req.params.organization
      );
      res.json({ data: donations });
    } catch (error) {
      console.error("Error getting donations by organization:", error);
      res.status(500).json({ error: "Failed to get donations" });
    }
  }
);

export default router;
