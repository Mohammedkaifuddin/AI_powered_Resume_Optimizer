import { Router } from "express";
import { authmiddleware } from "../middleware/authmiddleware";
import { analyzeresumewithgemini } from "../services/geminiservice";

const router = Router();

router.post(
  "/analyze",
  authmiddleware,
  async (req, res, next) => {
    try {
      const { resumeText, jobDescription } = req.body;

      if (
        typeof resumeText !== "string" ||
        typeof jobDescription !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "resumeText and jobDescription are required",
        });
      }

      const response = await analyzeresumewithgemini(
        resumeText,
        jobDescription,
      );

      return res.status(200).json({
        success: true,
        response,
      });
    } catch (error) {
      console.error("Gemini error:", error);
      next(error);
    }
  },
);

export default router;