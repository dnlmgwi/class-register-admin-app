import type { Readable } from "svelte/motion";
import { UserRole } from "./enums/UserRole";
import { redirect } from "@sveltejs/kit";
import * as jose from "jose";
import { jwtSecret } from "./constants";
import type { User } from "../../types";

function parseEnum<T extends { [key: string]: string }>(
  enumType: T,
  value: string
): T[keyof T] | null {
  const values = Object.values(enumType) as string[];
  if (values.includes(value)) {
    return value as T[keyof T];
  }
  return null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

async function isAuthorized(user: User | null): Promise<Boolean> {
  if (!user) {
    redirect(303, "/auth/login");
  }

  switch (user.role) {
    case UserRole.Admin:
      return true;
    case UserRole.SuperAdmin:
      return true;
    case UserRole.Coordinator:
      return true;
    case UserRole.Lecturer:
      return true;
    default:
      return false;
  }
}
export { getErrorMessage, parseEnum, isAuthorized };
