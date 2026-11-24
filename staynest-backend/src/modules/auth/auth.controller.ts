import type { Request, Response } from "express";
import { createUserSchema, logInSchema } from "./auth.validator";
import { sendError, sendSuccess } from "../../utils/response";
import { asyncHanlder } from "../../utils/asyncHandler";
import {
  createUser,
  getUser,
  getUserById,
  logoutUser,
  signInUser,
} from "./auth.service";
import { checkPassword, hashPassword } from "../../utils/hashPassword";
import { validateRequestBody } from "../../utils/validateReq";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import jwt from "jsonwebtoken";

export const signUpHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const data = validateRequestBody(req, res, createUserSchema);

    const { email, password } = data;

    const existingUser = await getUser(email);

    if (existingUser) {
      return sendError(res, 409, "User already exists with this email");
    }

    const hasedPassword = await hashPassword(password);

    const createdUser = await createUser({ ...data, password: hasedPassword });

    return sendSuccess(res, 201, "User created successfully", createdUser);
  },
);

export const signInHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const data = validateRequestBody(req, res, logInSchema);

    const { email, password } = data;

    const user = await getUser(email);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const isCorrectPassword = await checkPassword(password, user.password);

    if (!isCorrectPassword) {
      return sendError(res, 401, "Invalid credentials");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: user.id });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    const token = await signInUser(user.id, refreshToken);

    return sendSuccess(res, 200, "Login successful", token);
  },
);

export const refreshAccessTokenAndRefreshToken = asyncHanlder(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return sendError(res, 401, "Unauthorized user");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);

    const user = await getUserById((decoded as any).id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ id: user.id });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
    });

    const token = await signInUser(user.id, newRefreshToken);

    return sendSuccess(res, 200, "Login successful", token);
  },
);

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const logoutHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { id } = (req as any).user;

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    const user = await logoutUser(id)

    return sendSuccess(res, 200, "Logout successful" , user);
  }
);
