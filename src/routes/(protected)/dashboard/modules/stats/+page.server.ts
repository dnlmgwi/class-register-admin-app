// +page.server.ts
import { baseUrl } from "$lib/utils/constants";
import { isAuthorized } from "$lib/utils/utilFunc";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import type { PaginatedResult } from "$lib/utils/types/types";
import type { UserWithProfileDTO } from "$lib/domain/valueObjects/UserWithProfileDTO";
import { createStudentSchema } from "$lib/domain/validators/User/createStudentValidator";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");
  const role = url.searchParams.get("role") ?? "student";

  if (!locals.jwt) {
    throw error(401, 'Not authenticated');
  }

  try {
    // Initialize the form with server-side validation
    const form = await superValidate(zod(createStudentSchema));

    // Check user authorization
    const isAdmin = await isAuthorized(locals.user);

    // Fetch users data
    const response = await fetch(
        `${baseUrl}/api/v1/user?role=${role}&status=active&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${locals.jwt}`,
            "Content-Type": "application/json",
          },
        }
    );

    if (!response.ok) {
      throw error(response.status, 'Failed to fetch users data');
    }

    const { data } = await response.json() as PaginatedResult<UserWithProfileDTO>;

    return {
      form,
      users: data.value,
      meta: data.meta,
      unauthorized: !isAdmin
    };
  } catch (err) {
    console.error('Server load error:', err);
    throw error(500, 'Failed to load users data');
  }
};