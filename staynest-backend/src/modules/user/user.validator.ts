import { z } from "zod";

export const updateUserSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),

  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),

  phone: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^[0-9]+$/, "Phone must contain only digits")
    .optional(),
});