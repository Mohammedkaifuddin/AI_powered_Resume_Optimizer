import { Router } from "express";
import { authmiddleware } from "../middleware/authmiddleware";
import { createjobdescription, getmyjobdescription, getjobdescriptionbyid, deletejobdescription } from "../controllers/jobdescriptioncontroller";

const router = Router();

router.post("/", authmiddleware, createjobdescription);
router.get("/", authmiddleware, getmyjobdescription);
router.get("/:id", authmiddleware, getjobdescriptionbyid);
router.delete("/:id", authmiddleware, deletejobdescription);

export default router;