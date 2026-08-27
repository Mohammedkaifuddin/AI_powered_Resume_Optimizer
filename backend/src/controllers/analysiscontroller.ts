// Import Express request, response and next-function types.
import { Request, Response, NextFunction } from "express";

// Import Prisma so we can read the Analysis table.
import prisma from "../config/db";

// This function returns all analyses belonging to the logged-in user.
export const getmyanalyses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Find all analysis records where userId
    // matches the user authenticated by our JWT.
    const analyses = await prisma.analysis.findMany({
      where: {
        userId: req.userId!,
      },
      // Show newest analyses first.
      orderBy: {
        createdAt: "desc",
      },
    });

    // Send the analyses back to the frontend.
    return res.status(200).json({
      success: true,
      analyses,
    });
  } catch (error) {
    // Send unexpected errors to our error middleware.
    next(error);
  }
};


// Get one analysis belonging to the logged-in user.
export const getanalysisbyid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the analysis ID from the URL.
    //
    // Example:
    // /api/analyses/abc123
    //
    // req.params.id = "abc123"
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis ID",
      });
    }

    // Find the analysis only when:
    //
    // 1. The ID matches
    // 2. The analysis belongs to the logged-in user
    const analysis = await prisma.analysis.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if(!analysis){
        return res.status(404).json({
            success: false,
            message: "Analysis not found",
        });
    }

    // If no matching record was found,
    // return 404.
    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    // Send unexpected errors to error middleware.
    next(error);
  }
};