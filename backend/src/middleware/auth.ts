import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { env } from "../config/env";
import { User } from "../models/User";
import { AuthRequest, JwtPayload } from "../types";
import { AppError } from "../utils/AppError";

export const protect = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) return next(new AppError("Authentication token is required", 401));

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    const user = await User.findById(decoded.userId);
    if (!user) return next(new AppError("User no longer exists", 401));

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};
