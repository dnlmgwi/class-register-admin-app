import { z } from "zod";

// export const profileSchema = z.object({
//   id: z.string(),
//   firstName: z.string(),
//   lastName: z.string(),
//   dateOfBirth: z.string(),
//   role: z.nativeEnum(UserRole),
//   gender: z.nativeEnum(Gender),
//   ageGroup: z.nativeEnum(AgeGroup),
//   currentLivingSituation: z.string(),
//   referringAgency: z.string(),
//   caseManager: z.string(),
//   alternateContact: z.string(),
//   qualifyingDisability: z.nativeEnum(Bool).default(Bool.No),
//   knownHealthIssues: z.string(),
//   householdMembers: z.number().int(),
//   latitude: z.number(),
//   longitude: z.number(),
//   userId: z.string(),
//   createdAt: z.string(),
// });

const profileSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: z.enum(["male", "female", "other"]),
  ageGroup: z.enum(["child", "adolescent", "adult", "senior"]),
  currentLivingSituation: z.string().nullable(),
  referringAgency: z.string().nullable(),
  caseManager: z.string().nullable(),
  alternateContact: z.string().nullable(),
  qualifyingDisability: z.enum(["yes", "no"]),
  knownHealthIssues: z.string().nullable(),
  householdMembers: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  userId: z.string(),
  createdAt: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  role: z.enum(["beneficiary", "auditor", "admin", "benefactor"]),
  profile: profileSchema,
});

export type InsertProfile = z.infer<typeof userSchema>;
