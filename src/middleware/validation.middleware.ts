import type { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../pkg/error/error.js";
import { fileTypeFromBuffer } from "file-type";
import type { ZodType } from "zod";

type SourceTpe = "body" | "params";

export function validateDto<T>(
  dto: ZodType<T>,
  source: SourceTpe = "body",
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = dto.safeParse(req[source]);

    if (!result.success) {
      const errMsgs = result.error.issues
        .map((issue) => `${issue.path.join(".")} : ${issue.message}`)
        .join(", ");

      return next(new AppError(errMsgs, 400));
    }

    req[source] = result.data;
    next();
  };
}

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
