import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response";

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return sendError(res, 403, "Forbidden: insufficient permissions");
    }

    next();
  };
};
