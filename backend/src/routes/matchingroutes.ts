import { Router } from "express";
import { authmiddleware } from "../middleware/authmiddleware";
import { analyzeresume } from "../controllers/matchingcontroller";

const router = Router();

router.post("/analyze", authmiddleware, analyzeresume);

export default router;