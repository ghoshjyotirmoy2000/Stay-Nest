import type { Request, Response } from "express";
import { asyncHanlder } from "../../utils/asyncHandler";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  getRoomsByHotelId,
  deleteRoom,
} from "./room.service";
import { getHotelById } from "../hotel/hotel.service";
import { sendError, sendSuccess } from "../../utils/response";
import { validateRequestBody } from "../../utils/validateReq";
import { createRoomSchema } from "./room.validator";
import { generatePresignedUrl } from "../../utils/getPresignedUrl";

export const createRoomHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { hotelId } = req.params as { hotelId: string };
    const { id: userId } = (req as any).user;

    const hotel = await getHotelById(hotelId);

    if (!hotel) {
      return sendError(res, 404, "Hotel not found");
    }

    if (hotel.ownerId !== userId) {
      return sendError(res, 403, "You do not own this hotel");
    }

    const data = validateRequestBody(req, res, createRoomSchema);

    const room = await createRoom({ ...data, hotelId });

    return sendSuccess(res, 201, "Room created successfully", room);
  }
);

export const getAllRoomsHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const rooms = await getAllRooms();

    return sendSuccess(res, 200, "Rooms fetched successfully", { rooms });
  }
);

export const getRoomByIdHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { roomId } = ( req as any).params;

    const room = await getRoomById(roomId);

    if (!room) {
      return sendError(res, 404, "Room not found");
    }
    

    return sendSuccess(res, 200, "Room fetched successfully", room);
  }
);

export const getRoomsByHotelIdHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { hotelId } = ( req as any).params;

    const rooms = await getRoomsByHotelId(hotelId);

    return sendSuccess(res, 200, "Rooms fetched successfully", { rooms });
  }
);

export const deleteRoomHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { roomId } = ( req as any).params;
    const { id: userId } = (req as any).user;

    const room = await getRoomById(roomId);

    if (!room) {
      return sendError(res, 404, "Room not found");
    }

    const hotel = await getHotelById(room.hotelId);

    if (!hotel || hotel.ownerId !== userId) {
      return sendError(res, 403, "You do not own this room");
    }

    await deleteRoom(roomId);

    return sendSuccess(res, 200, "Room deleted successfully");
  }
);

export const getPresignedUrlForRoomImage = asyncHanlder(
  async (req: Request, res: Response) => {
    const { contentType } = req.body;
    const urls = await generatePresignedUrl("images/room", contentType, "staynest");
    return sendSuccess(res, 200, "generated presigned url and final url", urls);
  },
);