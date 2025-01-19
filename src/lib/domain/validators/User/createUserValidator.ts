import { z } from "zod";
import { SelectUserRole } from "$lib/utils/enums/UserRole";
import {validationService} from "$lib/dependencies";

export const phoneSchema = z.string().refine(
    (phone) => validationService.validatePhoneNumber(phone,"MW"),
    {
      message: 'Invalid phone number format. Please use format: 265XXXXXXXXX for Malawi numbers'
    }
);

export const createUserSchema = z.object({
  phone: phoneSchema,
  role: z.nativeEnum(SelectUserRole, {
    errorMap: () => {
      return {
        message: `Role must be one of: ${Object.values(SelectUserRole).join(
          ", "
        )}`,
      };
    },
  }),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Invalid Email Address" }),
  avatarUrl: z
    .string()
    .url({ message: "Invalid Avatar URL" })
    .default(
      "https://csqaiejkcporxddqwans.supabase.co/storage/v1/object/public/uploads/218a145f-63ad-41ca-a32a-4ebceb6bdbd6/GHSTBUoW8AAoAHo.jpeg"
    ),
});
