import type { z } from "zod";
import type { attendanceWithRatingsValidator } from "../validators/Attendance/AttendanceWithRatingValidator";

export type AttendanceRegisterWithRatingDTO = z.infer<
  typeof attendanceWithRatingsValidator
>;
