import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["admin", "sessionAdmin", "user", "superAdmin"]).default("user"),
  gender: z.enum(["male", "female"]).default("male"),
  department: z.string().optional(),
});

export const userUpdateSchema = userSchema.partial();
