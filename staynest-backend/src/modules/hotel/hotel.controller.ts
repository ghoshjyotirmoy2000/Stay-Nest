import type { Request, Response } from "express";
import { asyncHanlder } from "../../utils/asyncHandler";
import {
  createHotel,
  deleteHotel,
  getAllHotel,
  getHotelById,
  getHotelByOwnerId,
  updateHotel,
} from "./hotel.service";
import { sendError, sendSuccess } from "../../utils/response";
import { validateRequestBody, validateRequestQuery } from "../../utils/validateReq";
import { createHotelSchema, hotelQuerySchema, updateHotelSchema } from "./hotel.validator";
import { generatePresignedUrl } from "../../utils/getPresignedUrl";

export const createHotelHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const ownerId = (req as any).user.id;
    const data = validateRequestBody(req, res, createHotelSchema);

    const hotel = await createHotel({ ...data, ownerId });

    return sendSuccess(res, 201, "Hotel created successfully", hotel);
  },
);

export const getAllHotelHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const data = validateRequestQuery(req, res, hotelQuerySchema);

    // db query
    const hotels = await getAllHotel(data);

    return sendSuccess(res, 201, "Hotel fetched successfully", { hotels });
  },
);

export const getAllHotelByIdHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { hotelId } = (req as any).params;

    const hotel = await getHotelById(hotelId);

    if (!hotel) {
      return sendError(res, 404, "Hotel not found");
    }

    return sendSuccess(res, 200, "Hotel fetched successfully", hotel);
  },
);

export const getAllHotelByOwnerIdHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { id } = (req as any).user;

    const hotels = await getHotelByOwnerId(id);

    return sendSuccess(res, 201, "Hotel created successfully", { hotels });
  },
);

export const getHotelsByOwnerIdForAdminHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { ownerId } = req.params as { ownerId: string };

    const hotels = await getHotelByOwnerId(ownerId);

    return sendSuccess(res, 200, "Hotels fetched successfully", { hotels });
  },
);

export const updateHotelHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { hotelId } = (req as any).params;
    const { id: userId } = (req as any).user;

    const existingHotel = await getHotelById(hotelId);

    if (!existingHotel) {
      return sendError(res, 404, "Hotel not found");
    }

    if (existingHotel.ownerId !== userId) {
      return sendError(res, 403, "You do not own this hotel");
    }

    const data = validateRequestBody(req, res, updateHotelSchema);

    const hotel = await updateHotel(hotelId, data);

    return sendSuccess(res, 200, "Hotel updated successfully", hotel);
  },
);

export const deleteHotelHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { hotelId } = (req as any).params;
    const { id: userId } = (req as any).user;

    const existingHotel = await getHotelById(hotelId);

    if (!existingHotel) {
      return sendError(res, 404, "Hotel not found");
    }

    if (existingHotel.ownerId !== userId) {
      return sendError(res, 403, "You do not own this hotel");
    }

    await deleteHotel(hotelId);

    return sendSuccess(res, 200, "Hotel deleted successfully");
  },
);

export const getPresignedUrlForHotelImage = asyncHanlder(
  async (req: Request, res: Response) => {
    const { contentType } = req.body;
    const urls = await generatePresignedUrl("images/hotel", contentType, "staynest");
    return sendSuccess(res, 200, "generated presigned url and final url", urls);
  },
);