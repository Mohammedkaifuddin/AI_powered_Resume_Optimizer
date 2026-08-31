import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authmiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ------------------------------------------------------
  // 1. Check JWT secret
  // ------------------------------------------------------

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured.");

    return res.status(500).json({
      success: false,
      message: "Server authentication configuration error",
    });
  }

  // ------------------------------------------------------
  // 2. Get Authorization header
  // ------------------------------------------------------

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // ------------------------------------------------------
  // 3. Validate Bearer token
  // ------------------------------------------------------

  const [schema, token] = authHeader.split(" ");

  if (schema !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization header",
    });
  }

  // ------------------------------------------------------
  // 4. Verify token
  // ------------------------------------------------------

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (
      typeof decoded === "string" ||
      !decoded.userId ||
      typeof decoded.userId !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // ----------------------------------------------------
    // 5. Attach authenticated user ID
    // ----------------------------------------------------

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};