import type { Request, Response, NextFunction } from "express";
import AppError from "../pkg/error/error.js";


export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};