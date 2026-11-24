import { z } from "zod";

export const createReviewSchema = z.object({
  hotelId: z
    .string()
    .min(1, "Hotel ID is required"),

  bookingId: z
    .string()
    .min(1, "Booking ID is required"),

  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),

  comment: z
    .string()
    .optional(),
});