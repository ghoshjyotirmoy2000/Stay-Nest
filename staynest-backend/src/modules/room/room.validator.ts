import { z } from "zod";

export const createRoomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, "Room number is required"),

  roomType: z
    .string()
    .min(2, "Room type must be at least 2 characters"),

  pricePerNight: z
    .number()
    .positive("Price must be a positive number"),

  maxOccupancy: z
    .number()
    .int("Max occupancy must be an integer")
    .positive("Max occupancy must be at least 1"),

  images: z
    .array(z.string().url("Invalid image URL"))
    .optional()
    .default([]),
});