import { Router } from "express";
import { testGemini } from "../services/geminiservice";

const router = Router();

router.get("/test", async(req, resizeBy, next) => {
    try{
        const response = await testGemini();

        return resizeBy.status(200).json({
            success: true,
            response,
        });
    }catch(error){
        console.error("Gemini error: ", error);
        next(error);
    }
});

export default router;