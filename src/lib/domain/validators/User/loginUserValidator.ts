import { z } from "zod";

export const loginUserSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "Phone is required" })
    .regex(/^\d{12}$/, {
      message: "Phone must be a 10-digit number with country code",
    }),
  password: z.string().min(5, { message: "5 Character Password is required" }),
});
