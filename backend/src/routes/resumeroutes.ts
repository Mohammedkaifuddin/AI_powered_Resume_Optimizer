import { Router } from "express";
import prisma from "../config/db";
import { upload } from "../middleware/uploadmiddleware";
import { extractresumetext } from "../services/resumeparserservices";
import { authmiddleware } from "../middleware/authmiddleware";
import { getMyResumes } from "../controllers/resumecontroller";
import { getresumebyid } from "../controllers/resumecontroller";
import { deleteresumes } from "../controllers/resumecontroller";

import { extractpdftext } from "../services/pdfservice";
import { extractDocText } from "../services/docxservice";

const router = Router();

router.post(
    "/upload",
    authmiddleware,
    upload.single("resume"),
    async(req, res, next) => {
        try{
            if(!req.file){
                return res.status(400).json({
                    success: false,
                    message: "Resume file is required",
                });
            }

            const text = await extractresumetext(req.file);

            // The generated Prisma client does not expose the model with a typed
            // `resume` delegate in this project configuration.
            const resume = await prisma.resume.create({
                data: {
                    userId: req.userId!,
                    fileName: req.file.originalname,
                    fileType: req.file.mimetype,
                    extractedText: text,
                },
            });

            return res.status(201).json({
                success: true,
                message: "Resume uploaded successfully",
                resume: {
                    id: resume.id,
                    fileName: resume.fileName,
                    fileType: resume.fileType,
                    createdAt: resume.createdAt,
                },
            });
        } catch (error){
            next(error);
        }
    }
);


//Get all resumes belonging to the logged-in user.
router.get("/", authmiddleware, getMyResumes);
router.get("/:id", authmiddleware, getresumebyid);
router.delete("/:id", authmiddleware, deleteresumes);

export default router;


































// router.post("/upload", upload.single("resume"), async(req, res) => {
//     if(!req.file){
//         return res.status(400).json({
//             success: false,
//             message: "Resume file is required",
//         });
//     }

//     // console.log("File name: ", req.file.originalname);
//     // console.log("Mime type: ", req.file.mimetype); 
    
//     const filename = req.file.originalname.toLowerCase();

//     // if(req.file.mimetype === "application/vnd.openxmlformats-officialdocument.wordprocessingml.document"){

//     //     const text = await extractDocText(req.file.buffer);

//     //     console.log(text);

//     //     return res.json({
//     //         success: true,
//     //         message: "DOCX text extracted successfully",
//     //         text,
//     //     });
//     // }

//     if(!filename.endsWith(".docx")){
//         return res.status(400).json({
//             success: false,
//             message: "DOCX file expected",
//         });
//     }

//     const text = await extractDocText(req.file.buffer);


//     return res.json({
//         success: true,
//         message: "DOCX text extracted successfully",
//         text,
//     });
// });

// export default router;
