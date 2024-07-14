import { z } from "zod";
import { DeviceStatus } from "$lib/utils/enums/DeviceStatus";

export const createDeviceSchema = z.object({
  name: z.string(),
});
