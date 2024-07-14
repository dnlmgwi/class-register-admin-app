import { z } from "zod";
import { DeviceStatus } from "$lib/utils/enums/DeviceStatus";

export const getDeviceSchema = z.object({
  id: z.string(),
  expires: z.string(),
  name: z.string(),
  status: z.nativeEnum(DeviceStatus).default(DeviceStatus.Offline),
  createdAt: z.string(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});