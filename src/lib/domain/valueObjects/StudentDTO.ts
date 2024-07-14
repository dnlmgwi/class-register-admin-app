import { z } from "zod";
import type { createUserSchema } from "../validators/User/createUserValidator";
import type { createStudentSchema } from "../validators/User/createStudentValidator";

export type StudentDTO = z.infer<typeof createStudentSchema>;
