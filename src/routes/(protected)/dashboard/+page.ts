import type { PageLoad } from "./$types";
import { baseUrl } from "$lib/utils/constants";

export const load: PageLoad = async ({ fetch, parent }) => {
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

  const statsResponse = await fetch(`${baseUrl}/api/v1/stats`, {
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

  const { data: stats } = await statsResponse.json();

  // const profile = data as Profile;

  return {
    // user,
    // profile,
    stats,
    // markers,
  };
};
