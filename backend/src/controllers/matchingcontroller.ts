import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { matchingschema } from "../validation/matchingschema";
import { matchresumetojob } from "../services/matchingservice";
import { analyzeresumewithgemini } from "../services/geminiservice";

export const analyzeresume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ------------------------------------------------------
    // 1. Validate request body
    // ------------------------------------------------------

    const result = matchingschema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Resume ID and Job description ID are required",
        error: result.error.issues,
      });
    }

    // Get the IDs from the validated request.
    const { resumeId, jobDescriptionId } = result.data;

    // ------------------------------------------------------
    // 2. Find the user's resume
    // ------------------------------------------------------

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: req.userId!,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // ------------------------------------------------------
    // 3. Find the user's job description
    // ------------------------------------------------------

    const jobDescription = await prisma.jobDescription.findFirst({
      where: {
        id: jobDescriptionId,
        userId: req.userId!,
      },
    });

    if (!jobDescription) {
      return res.status(404).json({
        success: false,
        message: "Job description not found",
      });
    }

    // ------------------------------------------------------
    // 4. Run rule-based matching
    // ------------------------------------------------------

    const matchResult = matchresumetojob(
      resume.extractedText,
      jobDescription.description
    );

    // ------------------------------------------------------
    // 5. Save rule-based analysis
    // ------------------------------------------------------

    const analysis = await prisma.analysis.create({
      data: {
        userId: req.userId!,
        resumeId: resume.id,
        jobDescriptionId: jobDescription.id,

        skillScore: matchResult.skillScore,
        keywordScore: matchResult.keywordScore,
        score: matchResult.score,

        matchedSkills: matchResult.matchedskills,
        missingSkills: matchResult.missingskills,

        matchedKeywords: matchResult.matchedkeywords,
        missingKeywords: matchResult.missingkeywords,
      },
    });

    // ------------------------------------------------------
    // 6. Try Gemini
    // ------------------------------------------------------

    let aiAnalysis = null;

    try {
      aiAnalysis = await analyzeresumewithgemini(
        resume.extractedText,
        jobDescription.description
      );

      await prisma.analysis.update({
        where:{
            id: analysis.id,
        },
        data:{
            aiAnalysis: JSON.stringify(aiAnalysis),
        },
      });
    } catch (error) {
      console.error("AI analysis unavailable:", error);
    }

    // ------------------------------------------------------
    // 7. Return the complete result
    // ------------------------------------------------------

    return res.status(201).json({
      success: true,
      resumeId: resume.id,
      jobDescriptionId: jobDescription.id,
      analysisId: analysis.id,
      result: matchResult,
      aiAnalysis,
    });

  } catch (error) {
    next(error);
  }
};

// console.log("resume delegate:", !!prisma.resume);
// console.log("jobDescription delegate:", !!prisma.jobDescription);
// console.log("analysis delegate:", !!prisma.analysis);
