import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const getMyResumes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const resumes = await prisma.resume.findMany({
            where:{
                userId: req.userId!,
            },
            orderBy:{
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            resumes,
        });
    }catch(error){
        next(error);
    }
}

export const getresumebyid = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const { id } = req.params;

        const resume = await prisma.resume.findUnique({
            where: {
                id,
            },
        });

        if(!resume){
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        if(resume.userId !== req.userId){
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this resume",
            });
        }

        return res.status(200).json({
            success: true,
            resume,
        });
    }catch(error){
        next(error);
    }
}

export const deleteresumes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const { id } = req.params;

        const resume = await prisma.resume.findUnique({
            where:{
                id,
            },
        });

        if(!resume){
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }

        if(resume.userId !== req.userId){
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this resume",
            });
        }

        await prisma.resume.delete({
            where:{
                id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Resume deleted Successfully",
        });
    }catch(error){
        next(error);
    }
}