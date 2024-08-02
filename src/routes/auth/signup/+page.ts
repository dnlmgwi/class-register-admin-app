import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageLoad } from "./$types";
import { createUserSchema } from "$lib/domain/validators/User/createUserValidator";
import { createStudentSchema } from "$lib/domain/validators/User/createStudentValidator";

export const load: PageLoad = async () => {
  const form = await superValidate(zod(createUserSchema));

  const studentForm = await superValidate(zod(createStudentSchema));

  return {
    form,
    studentForm
  };
};
