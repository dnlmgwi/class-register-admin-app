import { z } from "zod";

export const profileIdSchema = z.object({
  id: z.string().min(1, { message: "Valid User ID required" }),
});
