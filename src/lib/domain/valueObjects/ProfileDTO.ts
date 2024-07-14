import { z } from "zod";
import type { userSchema } from "../validators/Profile/profileValidator";
import type { profileIdSchema } from "../validators/Profile";

export type UserDTO = z.infer<typeof userSchema>;

export type ProfilSchema = typeof profileIdSchema;
