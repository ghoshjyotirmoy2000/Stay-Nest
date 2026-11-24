import { z } from "zod";

export const hotelQuerySchema = z.object({
  city: z.string().optional(),

  country: z.string().optional(),

  amenities: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (typeof val === "string" ? [val] : val || [])),

  cursor: z.string().optional(),

  limit: z.coerce.number().optional(),
});

export const createHotelSchema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters"),

  description: z.string().optional(),

  city: z.string().min(2, "City must be at least 2 characters"),

  country: z.string().min(2, "Country must be at least 2 characters"),

  amenities: z.array(z.string()).default([]),

  images: z
    .array(z.string().url("Invalid image URL"))
    .optional()
    .default([]),
});

export const updateHotelSchema = z.object({
  name: z
    .string()
    .min(2, "Hotel name must be at least 2 characters")
    .optional(),

  description: z.string().optional(),

  city: z.string().min(2, "City must be at least 2 characters").optional(),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .optional(),

  amenities: z.array(z.string()).optional(),

  images: z
    .array(z.string().url("Invalid image URL"))
    .optional(),
});
