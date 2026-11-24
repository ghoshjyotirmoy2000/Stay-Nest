import type { NextFunction, Request, Response } from "express";
import { sendError } from "./response";

export const validateRequestBody = (
  req: Request,
  res: Response,
  schema: any,
) => {
  const parsedData = schema.safeParse(req.body);

  if (!parsedData.success) {
    return sendError(res, 400, "Validation failed" , parsedData.error);
  }

  return parsedData.data
};

export const validateRequestQuery = (
  req: Request,
  res: Response,
  schema: any,
) => {
  const parsedData = schema.safeParse(req.query);

  if (!parsedData.success) {
    return sendError(res, 400, "Validation failed" , parsedData.error);
  }

  return parsedData.data
};
