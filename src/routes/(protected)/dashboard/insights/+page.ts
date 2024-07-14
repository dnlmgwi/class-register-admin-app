import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";
import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { baseUrl } from "$lib/utils/constants";

export const load: PageLoad = async ({ fetch, parent, url }) => {
  let radius = url.searchParams.get("radius");
  let latitude = url.searchParams.get("latitude");
  let longitude = url.searchParams.get("longitude");

  // const form = await superValidate(zod(createBenefitSchema));

  const { jwt } = await parent();

  // if (!latitude || !longitude) {
  //   throw error(400, "Latitude and Longitude must be provided");
  // }

  const response = await fetch(
    `${baseUrl}/api/v1/profile/near?latitude=${latitude}&longitude=${longitude}&radius=${radius}&role=beneficiary`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },

      // credentials: "include", // Ensure cookies are included in the request
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch protected data ${await response.json()}`);
  }

  const { data: markers } = await response.json();

  return {
    markers,
    // form,
    jwt,
  };
};
