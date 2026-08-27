import { Router } from "express";
import { registeruser,  loginuser } from "../controllers/authcontroller";
import { authmiddleware } from "../middleware/authmiddleware";


const router = Router();

router.post("/register", registeruser);
router.post("/login", loginuser);

// router.get("/protected", authmiddleware, (req, res) =>{
//     res.json({
//         success: true,
//         message: "You accessed a protected route",
//         userId: req.userId,
//     });
// });

export default router;

