import { Router, Request, Response } from "express";
import { upload } from "../middleware";
import { MemberService } from "../services/memberService";

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
      const memberService = new MemberService();
      const result = await memberService.processCSV(csvData);

      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Error processing members CSV:", error);
      res.status(500).json({ error: "Failed to process CSV" });
    }
  }
);

// Data retrieval
router.get("/", async (req: Request, res: Response) => {
  try {
    const memberService = new MemberService();
    const filters = {
      organization: req.query.organization as string,
      has_contribution: req.query.has_contribution
        ? req.query.has_contribution === "true"
        : undefined,
    };
    const members = await memberService.getAll(filters);
    res.json({ success: true, data: members });
  } catch (error) {
    console.error("Error getting members:", error);
    res.status(500).json({ error: "Failed to get members" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const memberService = new MemberService();
    const member = await memberService.getById(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    console.error("Error getting member:", error);
    res.status(500).json({ error: "Failed to get member" });
  }
});

router.get(
  "/organization/:organization",
  async (req: Request, res: Response) => {
    try {
      const memberService = new MemberService();
      const members = await memberService.getByOrganization(
        req.params.organization
      );
      res.json({ success: true, data: members });
    } catch (error) {
      console.error("Error getting members by organization:", error);
      res.status(500).json({ error: "Failed to get members" });
    }
  }
);

router.get("/contributions/with", async (req: Request, res: Response) => {
  try {
    const memberService = new MemberService();
    const members = await memberService.getWithContributions();
    res.json({ success: true, data: members });
  } catch (error) {
    console.error("Error getting members with contributions:", error);
    res.status(500).json({ error: "Failed to get members" });
  }
});

export default router;
