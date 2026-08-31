import { Router } from "express";
import { authmiddleware } from "../middleware/authmiddleware";
import {
  getmyanalyses,
  getanalysisbyid,
  deleteanalysis,
  compareanalyses,
} from "../controllers/analysiscontroller";

const router = Router();

router.get("/", authmiddleware, getmyanalyses);
router.get("/:id", authmiddleware, getanalysisbyid);
router.delete("/:id", authmiddleware, deleteanalysis);
router.get("/compare/:oldId/:newId", authmiddleware, compareanalyses);

export default router;
