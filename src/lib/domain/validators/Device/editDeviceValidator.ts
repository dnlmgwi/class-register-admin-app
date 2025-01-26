import { z } from "zod";

export const editDeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
});
