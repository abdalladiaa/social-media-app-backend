import type { Response } from "express";

interface SuccessResponseOptions<T> {
  res: Response;
  status?: number;
  message?: string;
  data?: T;
}

export const successResponse = <T>({
  res,
  status = 200,
  message = "Done",
  data,
}: SuccessResponseOptions<T>) => {
  return res.status(status).json({
    success: true,
    status,
    message,
    data,
  });
};
