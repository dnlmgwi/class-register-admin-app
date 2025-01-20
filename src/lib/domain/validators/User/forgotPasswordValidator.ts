import { z } from "zod";
import { SelectUserRole } from "$lib/utils/enums/UserRole";
import {validationService} from "$lib/dependencies";

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
});
