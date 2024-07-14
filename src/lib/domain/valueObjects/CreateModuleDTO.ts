import type { z } from "zod";
import type { createModuleSchema } from "$lib/domain/validators/Module/createModuleValidator";

export type CreateModuleDTO = z.infer<typeof createModuleSchema>;
