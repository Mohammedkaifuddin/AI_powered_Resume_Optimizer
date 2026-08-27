import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
) => {
    const allowedtypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if(allowedtypes.includes(file.mimetype)){
        callback(null, true);
    }else{
        callback(new Error("only PDF and DOCX files are allowed"));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});