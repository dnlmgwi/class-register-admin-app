// +page.server.ts
import { redirect, fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { baseUrl, nodeEnv } from "$lib/utils/constants";
import { UserRole } from "$lib/utils/enums/UserRole";
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createUserSchema } from '$lib/domain/validators/User/createUserValidator';
import { createStudentSchema } from '$lib/domain/validators/User/createStudentValidator';

export const load: PageServerLoad = async ({ locals }) => {
  // Redirect if already authenticated
  if (locals.jwt) {
    throw redirect(302, "/dashboard");
  }

  // Initialize both forms with zod adapter
  const form = await superValidate(zod(createUserSchema));
  const studentForm = await superValidate(zod(createStudentSchema));

  return {
    form,
    studentForm,
    jwt: locals.jwt,
  };
};

export const actions: Actions = {
  signup: async ({ request, cookies, fetch }) => {
    const form = await superValidate(request, zod(createUserSchema));

    try {
      // Validate form data
      if (!form.valid) {
        return fail(400, { form });
      }

      const response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.data),
      });

      const result = await response.json();

      if (!response.ok) {
        return fail(response.status, {
          form,
          error: result.error || 'Signup failed'
        });
      }

      // Set JWT cookie
      cookies.set('jwt', result.data, {
        httpOnly: true,
        secure: nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      throw redirect(302, "/auth");
    } catch (error) {
      console.error('Signup error:', error);

      return fail(500, {
        form,
        error: error instanceof Error ? error.message : 'An error occurred during signup'
      });
    }
  }
};