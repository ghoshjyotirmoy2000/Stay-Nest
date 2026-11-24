import { z } from "zod";

export const createBookingSchema = z.object({
  roomId: z
    .string()
    .min(1, "Room ID is required"),

  hotelId: z
    .string()
    .min(1, "Hotel ID is required"),

  checkInDate: z.coerce.date(),

  checkOutDate: z.coerce.date(),

  guests: z
    .number()
    .int("Guests must be an integer")
    .positive("Guests must be at least 1"),

}).refine(
  (data) => data.checkOutDate > data.checkInDate,
  {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  }
);