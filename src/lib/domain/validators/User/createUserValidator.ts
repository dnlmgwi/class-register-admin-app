import { z } from "zod";
import { UserRole } from "../../../utils/enums/UserRole";

export const createUserSchema = z.object({
  phone: z.string().min(1, { message: "Phone is required" }),
  password: z.string().min(5, { message: "5 Character Password is required" }),
  role: z.nativeEnum(UserRole, {
    errorMap: () => {
      return {
        message: `Role must be one of: ${Object.values(UserRole).join(", ")}`,
      };
    },
  }),
  country: z.string().min(2, { message: "Valid Country Code Required" }),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Invalid Email Address" }),
  avatarUrl: z.string().url({ message: "Invalid Avatar URL" }),
});
