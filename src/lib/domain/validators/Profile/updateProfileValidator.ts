import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  phone: z
    .string()
    .min(1, { message: "Phone is required" })
    .regex(/^\d{10}$/, { message: "Phone must be a 10-digit number" }),
  password: z.string().min(5, { message: "5 Character Password is required" }),
  options: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
});
