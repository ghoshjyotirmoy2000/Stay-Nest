import { z } from "zod";

export const roleEnum = z.enum(["CUSTOMER", "OWNER"]); // update if needed

export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),

  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters"),

  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: roleEnum,

  phone: z
  .string()
  .length(10, "Phone number must be 10 digits")
  .regex(/^[0-9]+$/, "Phone must contain only digits"),
});

export const logInSchema = z.object({
    email : z.string().email("Invalid Email"),
    password : z.string()
})