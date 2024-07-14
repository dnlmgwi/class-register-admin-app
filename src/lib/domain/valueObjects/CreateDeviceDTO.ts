import type { z } from "zod";
import type { createDeviceSchema } from "../validators/Device/createDeviceValidator";

export type CreateDeviceDTO = z.infer<typeof createDeviceSchema>;
