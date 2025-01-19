// +page.server.ts
import { baseUrl } from "$lib/utils/constants";
import type { PaginatedResult } from "$lib/utils/types/types";
import type { ModuleDTO } from "$lib/domain/valueObjects/ModuleDTO";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { createModuleSchema } from "$lib/domain/validators/Module/createModuleValidator";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");

  if (!locals.jwt) {
    throw error(401, 'Not authenticated');
  }

  try {
    // Initialize the form with server-side validation
    const form = await superValidate(zod(createModuleSchema));

    // Fetch modules data
    const response = await fetch(
        `${baseUrl}/api/v1/module?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${locals.jwt}`,
            "Content-Type": "application/json",
          },
        }
    );

    if (!response.ok) {
      throw error(response.status, 'Failed to fetch modules data');
    }

    const { data } = await response.json() as PaginatedResult<ModuleDTO>;

    return {
      form,
      modules: data.value,
      meta: data.meta
    };
  } catch (err) {
    console.error('Server load error:', err);
    throw error(500, 'Failed to load modules data');
  }
};