import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { jobdescriptionschema } from "../validation/jobdescriptionschema";
import { success } from "zod";

export const createjobdescription = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const result = jobdescriptionschema.safeParse(req.body);
        
        if(!result.success){
            return res.status(400).json({
                success: false,
                message: "Invalid job description data",
                errors: result.error.issues,
            });
        }

        const { title, description } = result.data;

        const jobdescription = await prisma.jobDescription.create({
            data:{
                userId: req.userId!,
                title,
                description,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Job description created successfully",
            jobdescription: {
                id: jobdescription.id,
                title: jobdescription.title,
                description: jobdescription.description,
                createdAt: jobdescription.createdAt,
            },
        });
    }catch (error){
        next(error);
    }
};

export const getmyjobdescription = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const jobdescriptions = await prisma.jobDescription.findMany({
            where:{
                userId: req.userId,
            },
            orderBy:{
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            jobdescriptions,
        });
    }catch(error){
        next(error);
    }
};

export const getjobdescriptionbyid = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const { id } = req.params;

        const jobdescription = await prisma.jobDescription.findFirst({
            where:{
                id: Array.isArray(id) ? id[0] : id,
                userId: req.userId
            },
        });

        if(!jobdescription){
            return res.status(404).json({
                success: false,
                message: "Job description not found",
            });
        }

        return res.status(200).json({
            success: true,
            jobdescription,
        });
    }catch(error){
        next(error);
    }
};

export const deletejobdescription = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const { id } = req.params;

        const jobdescription = await prisma.jobDescription.findFirst({
            where:{
                id: Array.isArray(id) ? id[0] : id,
                userId: req.userId!,
            },
        });

        if(!jobdescription){
            return res.status(404).json({
                success: false,
                message: "Job description not found",
            });
        }

        await prisma.jobDescription.delete({
            where:{
                id: jobdescription.id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Job description deleted successfully",
        });
    }catch(error){
        next(error);
    }
};