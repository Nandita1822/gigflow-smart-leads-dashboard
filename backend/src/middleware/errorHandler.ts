import { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten()
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid resource id" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate resource" });
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof AppError ? error.message : "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    stack: env.nodeEnv === "production" ? undefined : error.stack
  });
};
