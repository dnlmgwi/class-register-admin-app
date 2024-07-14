import { baseUrl } from "$lib/utils/constants";
import type { PaginatedResult } from "$lib/utils/types/types";
import { cacheFetch } from "$lib/stores/cache";
import type { PageLoad } from "./$types";
import type { DeviceDTO } from "$lib/domain/valueObjects/DeviceDTO";
import { createDeviceSchema } from "$lib/domain/validators/Device/createDeviceValidator";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageLoad = async ({ fetch, parent, url }) => {
  let page = url.searchParams.get("page");
  let limit = url.searchParams.get("limit");

  const { pathname } = url;

  const { jwt } = await parent();

  const form = await superValidate(zod(createDeviceSchema));

  // https://www.telerik.com/blogs/client-caching-sveltekit
  const cacheKey = `${pathname}?page=${page}&limit=${limit}`;

  const response = await cacheFetch<PaginatedResult<DeviceDTO>>(
    cacheKey,
    () =>
      fetch(`${baseUrl}/api/v1/device?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }),
    false // Set to true if you want to force a refresh
  );

  const { data } = response;

  const devices = data.value;
  const meta = data.meta;
  return {
    form,
    devices,
    meta,
    jwt,
  };
};
