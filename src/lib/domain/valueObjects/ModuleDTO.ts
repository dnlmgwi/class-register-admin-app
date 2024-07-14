import type { z } from "zod";
import type { getModuleSchema } from "../validators/Module/getModuleValidator";

export type ModuleDTO = z.infer<typeof getModuleSchema>;
