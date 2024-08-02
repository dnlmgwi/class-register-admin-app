import { baseUrl } from "$lib/utils/constants";
import { isAuthorized } from "$lib/utils/utilFunc";
import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { cacheFetch } from "$lib/stores/cache";
import type { PaginatedResult } from "$lib/utils/types/types";
import type { User } from "../../../../../types";
import type { UserWithProfileDTO } from "$lib/domain/valueObjects/UserWithProfileDTO";
import { createStudentSchema } from "$lib/domain/validators/User/createStudentValidator";

export const load: PageLoad = async ({ fetch, parent, url }) => {
  let page = url.searchParams.get("page");
  let limit = url.searchParams.get("limit");
  let role = url.searchParams.get("role") ?? "student";
  const { jwt, user } = await parent();

  const { pathname } = url;

  const form = await superValidate(zod(createStudentSchema));

  // https://www.telerik.com/blogs/client-caching-sveltekit
  const cacheKey = `${pathname}?page=${page}&limit=${limit}`;

  const response = await cacheFetch<PaginatedResult<UserWithProfileDTO>>(
    cacheKey,
    () =>
      fetch(
        `${baseUrl}/api/v1/user?role=${
          role ?? "student"
        }&status=active&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      ),
    false // Set to true if you want to force a refresh
  );

  const { data } = response;

  const users = data.value;
  const meta = data.meta;

  const isAdmin = await isAuthorized(user);

  if (!isAdmin) {
    return { unauthorized: true, form, jwt, users, meta };
  }

  return {
    meta,
    unauthorized: false,
    form,
    jwt,
    users,
  };
};

// import { cacheFetch } from "$lib/stores/cache";
// import { baseUrl } from "$lib/utils/constants";
// import type { PaginatedResult } from "$lib/utils/types/types";
// import type { PageLoad } from "./$types";

// export const load: PageLoad = async ({ fetch, parent, url }) => {
//   let page = url.searchParams.get("page");
//   let limit = url.searchParams.get("limit");
//   const { pathname } = url;

//   const { jwt } = await parent();

//   // https://www.telerik.com/blogs/client-caching-sveltekit
//   const cacheKey = `${pathname}?page=${page}&limit=${limit}`;

//   const response = await cacheFetch<PaginatedResult<Benefit>>(
//     cacheKey,
//     () =>
//       fetch(
//         `${baseUrl}/api/v1/user/users?page=${page}&limit=${limit}&status=active`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${jwt}`,
//             "Content-Type": "application/json",
//           },
//         }
//       ),
//     false // Set to true if you want to force a refresh
//   );

//   const { data } = response;

//   const users = data.data;
//   const meta = data.meta;
//   return {
//     users,
//     meta,
//     jwt,
//   };
// };
