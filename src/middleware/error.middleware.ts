import type AppError from "../pkg/error/error.js";
import { logger } from "../pkg/log/logger.js";
import type { Request, Response, NextFunction } from "express";

export default function errorMiddleWare(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err.message, { stack: err.stack });
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
