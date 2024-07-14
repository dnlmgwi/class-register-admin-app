import { z } from "zod";
import { UserRole } from "../../../utils/enums/UserRole";
import { createProfileValidator } from "../Profile/createProfileValidator";

export const getUserWithProfileSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(UserRole).default(UserRole.Student),
  profile: createProfileValidator,
});
