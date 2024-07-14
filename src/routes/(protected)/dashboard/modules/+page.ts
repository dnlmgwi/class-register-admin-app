import { baseUrl } from "$lib/utils/constants";
import type { PaginatedResult } from "$lib/utils/types/types";
import { cacheFetch } from "$lib/stores/cache";
import type { PageLoad } from "./$types";
import type { ModuleDTO } from "$lib/domain/valueObjects/ModuleDTO";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createModuleSchema } from "$lib/domain/validators/Module/createModuleValidator";

export const load: PageLoad = async ({ fetch, parent, url }) => {
  let page = url.searchParams.get("page");
  let limit = url.searchParams.get("limit");

  const form = await superValidate(zod(createModuleSchema));

  const { pathname } = url;

  const { jwt } = await parent();

  // https://www.telerik.com/blogs/client-caching-sveltekit
  const cacheKey = `${pathname}?page=${page}&limit=${limit}`;

  const response = await cacheFetch<PaginatedResult<ModuleDTO>>(
    cacheKey,
    () =>
      fetch(`${baseUrl}/api/v1/module?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }),
    false
  );

  const { data } = response;

  const modules = data.value;
  const meta = data.meta;

  return {
    form,
    modules,
    meta,
    jwt,
  };
};
