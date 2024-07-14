import { z } from "zod";

export const attendanceWithRatingsValidator = z.object({
  id: z.string(),
  avatarUrl: z.string().nullable(),
  studentId: z.string(),
  checkInDate: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  moduleId: z.string().nullable(),
  count: z.number(),
  rating: z.string().min(1),
});
