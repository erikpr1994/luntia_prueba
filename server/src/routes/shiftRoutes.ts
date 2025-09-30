import { Router, Request, Response } from "express";
import { upload } from "../middleware";
import { ShiftService } from "../services/shiftService";

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
      const shiftService = new ShiftService();
      const result = await shiftService.processCSV(csvData);

      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Error processing shifts CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

// Data retrieval
router.get("/", async (req: Request, res: Response) => {
  try {
    const shiftService = new ShiftService();
    const filters = {
      volunteer_id: req.query.volunteer_id as string,
      organization: req.query.organization as string,
      date_from: req.query.date_from as string,
      date_to: req.query.date_to as string,
    };
    const shifts = await shiftService.getAll(filters);
    res.json({ success: true, data: shifts });
  } catch (error) {
    console.error("Error getting shifts:", error);
    res.status(500).json({ error: "Failed to get shifts" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const shiftService = new ShiftService();
    const shift = await shiftService.getById(req.params.id);

    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    res.json({ success: true, data: shift });
  } catch (error) {
    console.error("Error getting shift:", error);
    res.status(500).json({ error: "Failed to get shift" });
  }
});

router.get("/volunteer/:volunteerId", async (req: Request, res: Response) => {
  try {
    const shiftService = new ShiftService();
    const shifts = await shiftService.getByVolunteer(req.params.volunteerId);
    res.json({ success: true, data: shifts });
  } catch (error) {
    console.error("Error getting shifts by volunteer:", error);
    res.status(500).json({ error: "Failed to get shifts" });
  }
});

export default router;
