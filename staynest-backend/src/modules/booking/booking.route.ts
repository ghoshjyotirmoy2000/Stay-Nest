import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  createBookingHandler,
  getAllBookingsHandler,
  getBookingByIdHandler,
  getBookingsByUserIdHandler,
  getBookingsByHotelIdHandler,
  cancelBookingHandler,
} from "./booking.controller";

const router = Router();

router.post("/create-booking", authMiddleware, createBookingHandler);
router.get("/all-bookings", getAllBookingsHandler);
router.get("/booking-by-id/:bookingId", authMiddleware, getBookingByIdHandler);
router.get("/bookings-by-user", authMiddleware, getBookingsByUserIdHandler);
router.get("/bookings-by-hotel/:hotelId", authMiddleware, getBookingsByHotelIdHandler);
router.patch("/cancel-booking/:bookingId", authMiddleware, cancelBookingHandler);

export default router;