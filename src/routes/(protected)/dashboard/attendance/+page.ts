import { baseUrl } from "$lib/utils/constants";
import type { PaginatedResult } from "$lib/utils/types/types";
import { cacheFetch } from "$lib/stores/cache";
import type { PageLoad } from "./$types";
import type { AttendanceRegisterDTO } from "$lib/domain/valueObjects/AttendanceRegisterDTO";
import type { ModuleDTO } from "$lib/domain/valueObjects/ModuleDTO";

export const load: PageLoad = async ({ fetch, parent, url }) => {
  let page = url.searchParams.get("page");
  let limit = url.searchParams.get("limit");

  const { pathname } = url;

  const { jwt } = await parent();

  // https://www.telerik.com/blogs/client-caching-sveltekit
  const attendanceCacheKey = `${pathname}?page=${page}&limit=${limit}`;

  const attendanceRegisterData = await cacheFetch<
    PaginatedResult<AttendanceRegisterDTO>
  >(
    attendanceCacheKey,
    () =>
      fetch(`${baseUrl}/api/v1/attendance?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }),
    false
  );

  const response = await fetch(`${baseUrl}/api/v1/module`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  const { data } = (await response.json()) as PaginatedResult<ModuleDTO>;

  const modules = data.value;
  const modulesMeta = data.meta;

  const { data: attendanceList } = attendanceRegisterData;

  const attendance = attendanceList.value;
  const meta = attendanceList.meta;

  return {
    modules,
    modulesMeta,
    attendance,
    meta,
    jwt,
  };
};
