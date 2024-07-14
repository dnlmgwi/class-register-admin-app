import type { User } from "./types";

declare namespace App {
  interface Locals {
    user: User | null;
    jwt: String | null;
  }
}

export interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: string;
  ageGroup: string;
  currentLivingSituation: string | null;
  referringAgency: string | null;
  caseManager: string | null;
  alternateContact: string | null;
  qualifyingDisability: string;
  knownHealthIssues: string | null;
  householdMembers: string | null;
  latitude: number;
  longitude: number;
  userId: string;
  createdAt: string;
}

export interface User {
  id: string;
  role: string;
}
