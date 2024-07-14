import { z } from "zod";
import type { getUserWithProfileSchema } from "../validators/User/getUserAndProfileValidator";

export type UserWithProfileDTO = z.infer<typeof getUserWithProfileSchema>;
