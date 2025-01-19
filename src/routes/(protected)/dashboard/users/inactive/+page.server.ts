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

  if (!locals.jwt) {
    throw error(401, 'Not authenticated');
  }

  const page = url.searchParams.get("page") ?? "1";
  const limit = url.searchParams.get("limit") ?? "10";
  const role = url.searchParams.get("role") ?? "student";
  const { pathname } = url;

  try {
    const form = await superValidate(zod(createStudentSchema));
    const isAdmin = await isAuthorized(locals.user);

    // Create cache key based on query parameters
    const cacheKey = `${pathname}?page=${page}&limit=${limit}&role=${role}`;

    // Fetch data with caching
    const response = await serverCacheFetch<PaginatedResult<UserWithProfileDTO>>(
        cacheKey,
        () => fetch(
            `${baseUrl}/api/v1/user?role=${role}&status=inactive&page=${page}&limit=${limit}`,
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
    throw error(500, 'Failed to load data');
  }
};

// Actions for cache management
export const actions = {
  invalidateCache: async () => {
    invalidateServerCache('users-');
    return { success: true };
  }
};