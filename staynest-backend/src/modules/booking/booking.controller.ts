import type { Request, Response } from "express";
import { asyncHanlder } from "../../utils/asyncHandler";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  getBookingsByHotelId,
  cancelBooking,
  checkBookingConflict,
} from "./booking.service";
import { sendError, sendSuccess } from "../../utils/response";
import { getRoomById } from "../room/room.service";

export const createBookingHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const data = req.body;

    const isAlreadyBooked = await checkBookingConflict(
      data.roomId,
      data.checkInDate,
      data.checkOutDate,
    );

    if (isAlreadyBooked) {
      return sendError(res, 409, "Room is already booked for these dates");
    }

    const room = await getRoomById(data.roomId);
    if (!room) {
      return sendError(res, 404, "Room not found");
    }

    const roomPrice = room?.pricePerNight;
    const diff =
      new Date(data.checkOutDate).getTime() -
      new Date(data.checkInDate).getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    const totalPrice = Number(roomPrice) * days;

    const booking = await createBooking({ ...data, userId, totalPrice });

    return sendSuccess(res, 201, "Booking created successfully", booking);
  },
);

export const getAllBookingsHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const bookings = await getAllBookings();

    return sendSuccess(res, 200, "Bookings fetched successfully", { bookings });
  },
);

export const getBookingByIdHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { bookingId } = (req as any).params;

    const booking = await getBookingById(bookingId);

    if (!booking) {
      return sendError(res, 404, "Booking not found");
    }

    return sendSuccess(res, 200, "Booking fetched successfully", booking);
  },
);

export const getBookingsByUserIdHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { id } = (req as any).user;

    const bookings = await getBookingsByUserId(id);

    return sendSuccess(res, 200, "Bookings fetched successfully", { bookings });
  },
);

export const getBookingsByHotelIdHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { hotelId } = (req as any).params;

    const bookings = await getBookingsByHotelId(hotelId);

    return sendSuccess(res, 200, "Bookings fetched successfully", { bookings });
  },
);

export const cancelBookingHandler = asyncHanlder(
  async (req: Request, res: Response) => {
    const { bookingId } = (req as any).params;

    const booking = await cancelBooking(bookingId);

    return sendSuccess(res, 200, "Booking cancelled successfully", booking);
  },
);
