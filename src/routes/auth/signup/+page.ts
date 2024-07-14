import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageLoad } from "./$types";
import { createUserSchema } from "$lib/domain/validators/User/createUserValidator";

export const load: PageLoad = async () => {
  const form = await superValidate(zod(createUserSchema));

  return {
    form,
  };
};