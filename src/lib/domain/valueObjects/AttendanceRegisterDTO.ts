import type { z } from "zod";
import type { attendanceRegisterSchema } from "../validators/Attendance/AttendanceRegisterValidator";

export type AttendanceRegisterDTO = z.infer<typeof attendanceRegisterSchema>;
