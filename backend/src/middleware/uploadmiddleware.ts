import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const allowedExtensions = [".pdf", ".docx"];

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const isValidType = allowedTypes.includes(
    file.mimetype,
  );

  const isValidExtension =
    allowedExtensions.includes(extension);

  if (isValidType && isValidExtension) {
    callback(null, true);
  } else {
    callback(
      new Error(
        "Only PDF and DOCX resume files are allowed.",
      ),
    );
  }
};

export const upload = multer({
  storage,

  fileFilter,

  limits: {
    // Maximum resume size: 5 MB
    fileSize: 5 * 1024 * 1024,

    // Only one file can be uploaded
    files: 1,
  },
});