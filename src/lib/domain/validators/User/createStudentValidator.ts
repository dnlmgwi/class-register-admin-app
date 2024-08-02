import { z } from "zod";

export const createStudentSchema = z.object({
  phone: z.string().min(1, { message: "Phone is required" }),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Invalid Email Address" }),
  avatarUrl: z
    .string()
    .url({ message: "Invalid Avatar URL" })
    .default(
      "https://csqaiejkcporxddqwans.supabase.co/storage/v1/object/public/uploads/218a145f-63ad-41ca-a32a-4ebceb6bdbd6/GHSTBUoW8AAoAHo.jpeg"
    ),
  studentId: z.string().min(1, { message: "Student ID is required" }),
});
