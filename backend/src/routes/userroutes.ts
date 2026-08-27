import { Router } from "express";
import { getUsers } from "../controllers/usercontroller";

const router = Router();

router.get("/", getUsers);

export default router;