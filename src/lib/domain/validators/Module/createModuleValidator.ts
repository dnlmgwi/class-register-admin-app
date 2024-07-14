import { z } from "zod";

export const createModuleSchema = z.object({
  moduleId: z.string(),
  moduleName: z.string(),
});
