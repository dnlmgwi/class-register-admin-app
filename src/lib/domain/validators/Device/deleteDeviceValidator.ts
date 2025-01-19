import { z } from "zod";
import { DeviceStatus } from "$lib/utils/enums/DeviceStatus";

export const deleteDeviceSchema = z.object({
  id: z.string(),
});