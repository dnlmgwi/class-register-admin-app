import { z } from "zod";

export const attendanceRegisterSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  checkInDate: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  moduleId: z.string(),
});
