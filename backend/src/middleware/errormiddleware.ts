import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errormiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Backend error:", error);

  // ---------------------------------------------
  // Multer errors
  // ---------------------------------------------

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must be 5 MB or less.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // ---------------------------------------------
  // File validation errors
  // ---------------------------------------------

  if (
    error instanceof Error &&
    error.message.includes("Only PDF and DOCX")
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // ---------------------------------------------
  // General errors
  // ---------------------------------------------

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};