import { redirect, type Actions } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.user,
    jwt: locals.jwt,
  };
};
