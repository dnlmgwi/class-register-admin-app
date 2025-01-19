import { baseUrl } from "$lib/utils/constants";
import { isAuthorized } from "$lib/utils/utilFunc";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import type { PaginatedResult } from "$lib/utils/types/types";
import type { UserWithProfileDTO } from "$lib/domain/valueObjects/UserWithProfileDTO";
import { createStudentSchema } from "$lib/domain/validators/User/createStudentValidator";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';
import { serverCacheFetch, invalidateServerCache } from '$lib/stores/serverCache';

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
  // Authentication check
  if (!locals.jwt) {
    throw error(401, 'Not authenticated');
  }

  try {
    // Get URL parameters with defaults
    const page = url.searchParams.get("page") ?? "1";
    const limit = url.searchParams.get("limit") ?? "10";
    const role = url.searchParams.get("role") ?? "student";
    const { pathname } = url;

    // Initialize form
    const form = await superValidate(zod(createStudentSchema));

    // Check authorization
    const isAdmin = await isAuthorized(locals.user);

    // Create cache key
    const cacheKey = `${pathname}?page=${page}&limit=${limit}&role=${role}`;

    // Fetch users with caching
    const response = await serverCacheFetch<PaginatedResult<UserWithProfileDTO>>(
        cacheKey,
        () => fetch(
            `${baseUrl}/api/v1/user?role=${role}&status=active&page=${page}&limit=${limit}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${locals.jwt}`,
                "Content-Type": "application/json",
              },
            }
        ),
        false // Set to true to force refresh
    );

    return {
      form,
      users: response.data.value,
      meta: response.data.meta,
      unauthorized: !isAdmin
    };

  } catch (err) {
    console.error('Load error:', err);
    throw error(500, {
      message: err instanceof Error ? err.message : 'Failed to load users data'
    });
  }
};