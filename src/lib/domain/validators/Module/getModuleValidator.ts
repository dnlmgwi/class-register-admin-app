import { z } from "zod";

export const getModuleSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  moduleName: z.string(),
  createdAt: z.string(),
});
