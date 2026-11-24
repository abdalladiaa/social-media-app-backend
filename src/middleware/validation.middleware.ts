import type { Request, Response, NextFunction } from "express";
import AppError from "../pkg/error/error.js";
import { fileTypeFromBuffer } from "file-type";

export function fileValidationMiddleware(allowedTypes: string | string[]) {
  const types = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new AppError("File is required", 400));
    }

    try {
      const type = await fileTypeFromBuffer(req.file.buffer);

      if (!type || !types.includes(type.mime)) {
        return next(new AppError("Invalid file type", 400));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
