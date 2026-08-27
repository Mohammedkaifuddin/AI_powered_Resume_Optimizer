import { extractpdftext } from "./pdfservice";
import { extractDocText } from "./docxservice";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const extractresumetext = async (
    file: Express.Multer.File
): Promise<string> => {
    if(file.mimetype === "application/pdf"){
        return extractpdftext(file.buffer);
    }

    if(file.mimetype == DOCX_MIME){
        return extractDocText(file.buffer);
    }

    throw new Error("Unsupported resume file type");
}