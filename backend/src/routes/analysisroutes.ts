import { Router } from "express";
import { authmiddleware } from "../middleware/authmiddleware";
import { getmyanalyses, getanalysisbyid } from "../controllers/analysiscontroller";

const router = Router();

router.get("/", authmiddleware, getmyanalyses);
router.get("/:id", authmiddleware, getanalysisbyid);

export default router;