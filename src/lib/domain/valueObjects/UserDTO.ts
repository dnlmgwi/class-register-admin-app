import { z } from "zod";
import type { createUserSchema } from "../validators/User/createUserValidator";

export type StudentDTO = z.infer<typeof createUserSchema>;
