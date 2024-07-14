import { z } from "zod";

export const createProfileValidator = z.object({
  id: z.string().min(1, { message: "Invalid ID format" }),
  userId: z.string().min(1, { message: "Invalid User ID format" }),
  name: z.string().min(1, { message: "Name is required" }),
  createdAt: z.string().datetime({ message: "Invalid date-time format" }),
  studentId: z.string().min(1, { message: "Invalid Student ID format" }),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Invalid Email format" }),
  avatarUrl: z.string().min(1, { message: "Invalid Avatar URL format" }),
  updatedAt: z.string().datetime({ message: "Invalid date-time format" }),
});
