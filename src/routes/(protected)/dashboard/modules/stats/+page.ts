import type { PageLoad } from "./$types";
import { baseUrl } from "$lib/utils/constants";
import type { AttendanceRegisterWithRatingDTO } from "$lib/domain/valueObjects/AttendanceRegisterWIthRatingsDTO";
import type { PaginatedResult } from "$lib/utils/types/types";

export const load: PageLoad = async ({ fetch, parent, url }) => {
  let id = url.searchParams.get("id");

  const { pathname } = url;

  const { jwt } = await parent();

  // const benefitsResponse = await fetch(
  //   `${baseUrl}/api/v1/benefit/benefactor/all`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${jwt}`,
  //     },
  //   }
  // );

  const response = await fetch(`${baseUrl}/api/v1/attendance/stats?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    // credentials: "include", // Ensure cookies are included in the request
  });

  // if (!response.ok || !statsResponse.ok) {
  //   throw new Error(`Failed to fetch protected data ${await response.json()}`);
  // }

  // const { data: markers } = await benefitsResponse.json();

  const { data } =
    (await response.json()) as PaginatedResult<AttendanceRegisterWithRatingDTO>;

  const stats = data.value;
  const meta = data.meta;

  return {
    // user,
    // profile,
    stats,
    meta,
    // markers,
  };
};
