import { Request, Response } from "express";
import { registerschema } from "../validation/registerschema";
import { loginschema } from "../validation/loginschema";
import prisma from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registeruser = async (req: Request, res: Response) => {
  const result = registerschema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data",
      errors: result.error.issues,
    });
  }

  const { name, email, password } = result.data;

  const existinguser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if(existinguser){
    return res.status(409).json({
        success: false,
        message: "Email already exists",
    });
  }

  const hashedpassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data:{
        name, 
        email,
        password: hashedpassword,
    },
  });

  console.log("Hashed password:", hashedpassword);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user:{
        id: user.id,
        name: user.name,
        email: user.email,
    },
  });
};


export const loginuser = async (req: Request, res: Response) => {
    const result = loginschema.safeParse(req.body);

    if(!result.success){
        return res.status(400).json({
            success: false,
            message: "Invalid login credantials",
            errors: result.error.issues,
        });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
        where:{
            email,
        },
        select:{
            id: true,
            email: true,
            password: true,
        }
    });

    if(!user){
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const ispasswordcorrect = await bcrypt.compare(
        password,
        user.password
    );

    if(!ispasswordcorrect){
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        {expiresIn: "7d"}
    );

    return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
    });
}