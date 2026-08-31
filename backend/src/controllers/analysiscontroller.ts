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
  next: NextFunction,
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
        id: id,
        // id: Array.isArray(id) ? id[0] : id,
        userId: req.userId!,
      },

      include: {
        resume: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
          },
        },

        jobDescription: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });
    if (!analysis) {
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

export const deleteanalysis = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const analysis = await prisma.analysis.findFirst({
      where: {
        id: Array.isArray(id) ? id[0] : id,
        userId: req.userId!,
      },
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    await prisma.analysis.delete({
      where: {
        id: analysis.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Compare two analyses belonging to the logged-in user.
export const compareanalyses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { oldId, newId } = req.params;

    if (typeof oldId !== "string" || typeof newId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis IDs",
      });
    }

    const [oldAnalysis, newAnalysis] = await Promise.all([
      prisma.analysis.findFirst({
        where: {
          id: oldId,
          userId: req.userId!,
        },
      }),

      prisma.analysis.findFirst({
        where: {
          id: newId,
          userId: req.userId!,
        },
      }),
    ]);

    if (!oldAnalysis) {
      return res.status(404).json({
        success: false,
        message: "Previous analysis not found",
      });
    }

    if (!newAnalysis) {
      return res.status(404).json({
        success: false,
        message: "Latest analysis not found",
      });
    }

    // ------------------------------------------------------
    // Determine chronological order automatically
    // ------------------------------------------------------

    let previousAnalysis = oldAnalysis;
    let latestAnalysis = newAnalysis;

    if (new Date(oldAnalysis.createdAt) > new Date(newAnalysis.createdAt)) {
      previousAnalysis = newAnalysis;
      latestAnalysis = oldAnalysis;
    }

    // ------------------------------------------------------
    // Convert JSON fields to arrays
    // ------------------------------------------------------

    const oldSkills = Array.isArray(previousAnalysis.matchedSkills)
      ? previousAnalysis.matchedSkills.map(String)
      : [];

    const newSkills = Array.isArray(latestAnalysis.matchedSkills)
      ? latestAnalysis.matchedSkills.map(String)
      : [];

    const oldMissingSkills = Array.isArray(previousAnalysis.missingSkills)
      ? previousAnalysis.missingSkills.map(String)
      : [];

    const newMissingSkills = Array.isArray(latestAnalysis.missingSkills)
      ? latestAnalysis.missingSkills.map(String)
      : [];

    const oldKeywords = Array.isArray(previousAnalysis.matchedKeywords)
      ? previousAnalysis.matchedKeywords.map(String)
      : [];

    const newKeywords = Array.isArray(latestAnalysis.matchedKeywords)
      ? latestAnalysis.matchedKeywords.map(String)
      : [];

    const oldMissingKeywords = Array.isArray(previousAnalysis.missingKeywords)
      ? previousAnalysis.missingKeywords.map(String)
      : [];

    const newMissingKeywords = Array.isArray(latestAnalysis.missingKeywords)
      ? latestAnalysis.missingKeywords.map(String)
      : [];
    // ------------------------------------------------------
    // Find added / removed skills
    // ------------------------------------------------------

    const addedSkills = newSkills.filter((skill) => !oldSkills.includes(skill));

    const removedSkills = oldSkills.filter(
      (skill) => !newSkills.includes(skill),
    );

    const resolvedMissingSkills = oldMissingSkills.filter(
      (skill) => !newMissingSkills.includes(skill),
    );

    const newlyMissingSkills = newMissingSkills.filter(
      (skill) => !oldMissingSkills.includes(skill),
    );

    // ------------------------------------------------------
    // Find added / removed keywords
    // ------------------------------------------------------

    const addedKeywords = newKeywords.filter(
      (keyword) => !oldKeywords.includes(keyword),
    );

    const removedKeywords = oldKeywords.filter(
      (keyword) => !newKeywords.includes(keyword),
    );

    const resolvedMissingKeywords = oldMissingKeywords.filter(
      (keyword) => !newMissingKeywords.includes(keyword),
    );

    const newlyMissingKeywords = newMissingKeywords.filter(
      (keyword) => !oldMissingKeywords.includes(keyword),
    );

    // ------------------------------------------------------
    // Score comparison
    // ------------------------------------------------------

    const comparison = {
      overall: {
        previous: previousAnalysis.score,
        latest: latestAnalysis.score,
        change: latestAnalysis.score - previousAnalysis.score,
      },

      skills: {
        previous: previousAnalysis.skillScore,
        latest: latestAnalysis.skillScore,
        change: latestAnalysis.skillScore - previousAnalysis.skillScore,
      },

      keywords: {
        previous: previousAnalysis.keywordScore,
        latest: latestAnalysis.keywordScore,
        change: latestAnalysis.keywordScore - previousAnalysis.keywordScore,
      },
    };

    // ------------------------------------------------------
    // Return comparison
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,

      previous: {
        id: previousAnalysis.id,
        resumeId: previousAnalysis.resumeId,
        jobDescriptionId: previousAnalysis.jobDescriptionId,
        createdAt: previousAnalysis.createdAt,
      },

      latest: {
        id: latestAnalysis.id,
        resumeId: latestAnalysis.resumeId,
        jobDescriptionId: latestAnalysis.jobDescriptionId,
        createdAt: latestAnalysis.createdAt,
      },

      comparison,

      changes: {
        addedSkills,
        removedSkills,

        resolvedMissingSkills,
        newlyMissingSkills,

        addedKeywords,
        removedKeywords,

        resolvedMissingKeywords,
        newlyMissingKeywords,
      },
    });
  } catch (error) {
    next(error);
  }
};
