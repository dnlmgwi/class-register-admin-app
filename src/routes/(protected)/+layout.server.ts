import type { LayoutServerLoad } from "../$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  return {
    jwt: cookies.get("jwt"),
    user: locals.user,
  };
};
