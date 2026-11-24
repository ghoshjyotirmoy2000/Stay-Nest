import type { Request, Response } from "express";
import { asyncHanlder } from "../../utils/asyncHandler";
import {
  getUserById,
  getAllUsers,
  getAllHotelAdmins,
  updateUser,
  deleteUser,
} from "./user.service";
import { sendError, sendSuccess } from "../../utils/response";

export const getMeHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { id } = (req as any).user;

    const user = await getUserById(id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, "User fetched successfully", user);
  }
);

export const getAllUsersHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const users = await getAllUsers();

    return sendSuccess(res, 200, "Users fetched successfully", { users });
  }
);

export const getAllHotelAdminsHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const hotelAdmins = await getAllHotelAdmins();

    return sendSuccess(res, 200, "Hotel admins fetched successfully", { hotelAdmins });
  }
);

export const updateUserHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { id } = (req as any).user;
    const data = req.body;

    const user = await updateUser(id, data);
    
    if(!user){
      return sendError(res , 500 , "Something went wrong")
    }

    return sendSuccess(res, 200, "User updated successfully", user);
  }
);

export const deleteUserHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { id } = (req as any).user;

    await deleteUser(id);

    return sendSuccess(res, 200, "User deleted successfully");
  }
);