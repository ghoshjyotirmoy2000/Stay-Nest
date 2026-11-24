import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return sendError(res, 401, "Unauthorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    (req as any).user = decoded;

    console.log("Pass through auth middleware", (req as any).user);

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Access token expired");
    }

    return sendError(res, 401, "Invalid token");
  }
};