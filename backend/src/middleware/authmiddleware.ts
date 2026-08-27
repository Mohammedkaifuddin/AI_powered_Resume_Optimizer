import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const authmiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    const [ schema, token ] = authHeader.split(" ");

    if(schema !== "Bearer" || !token){
        return res.status(401).json({
            success: false,
            message: "Invalid authorization header",
        });
    }

    try{
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET!
        );

        if(typeof decoded === "string"){
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }

        req.userId = decoded.userId as string;

        next();
        
    } catch (error){
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};