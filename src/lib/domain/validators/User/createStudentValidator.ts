import { z } from "zod";

export const createStudentSchema = z.object({
  phone: z.string().min(1, { message: "Phone is required" }),
  password: z.string().min(5, { message: "5 Character Password is required" }),
  country: z.string().min(2, { message: "Valid Country Code Required" }),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Invalid Email Address" }),
  avatarUrl: z.string().url({ message: "Invalid Avatar URL" }),
  studentId: z.string().min(1, { message: "Student ID is required" }),
});
