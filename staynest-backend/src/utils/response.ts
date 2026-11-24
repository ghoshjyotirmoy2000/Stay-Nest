import type { Response } from "express";

export const sendSuccess = (
  res: Response,
  statusCode: number = 200,
  message: string = "Success",
  data: object = {},
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode: number = 200,
  message: string = "Error",
  error?: any,
) => {
  res.status(statusCode).json({
    success: false,
    message,
    error:
      error?.issues || // ✅ Zod errors
      error?.message || // normal errors
      error,
  });
};
