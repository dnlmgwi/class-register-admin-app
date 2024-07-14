import type { z } from "zod";
import type { createDeviceSchema } from "../validators/Device/createDeviceValidator";
import type { getDeviceSchema } from "../validators/Device/getDeviceValidator";

export type DeviceDTO = z.infer<typeof getDeviceSchema>;
