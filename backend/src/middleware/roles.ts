import { NextFunction, Response } from "express";
import { AuthRequest, UserRole } from "../types";
import { AppError } from "../utils/AppError";

export const requireRoles =
  (...roles: UserRole[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError("Authentication required", 401));
    if (!roles.includes(req.user.role)) return next(new AppError("You do not have permission", 403));
    next();
  };
