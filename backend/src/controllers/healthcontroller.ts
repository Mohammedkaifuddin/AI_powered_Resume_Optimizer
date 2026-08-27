import { Request, Response } from "express";

export const healthCheck = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "AI Resume Matcher API is healthy",
  });
};