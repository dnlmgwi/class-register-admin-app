import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../../auth/$types";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  //   // Fetch some protected data
  //   const response = await fetch("http://localhost:8787/api/v1/user/me", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include", // Ensure cookies are included in the request
  //   });

  //   if (!response.ok) {
  //     throw new Error(`Failed to fetch protected data ${await response.json()}`);
  //   }

  //   const data = await response.json();

  return {
    jwt: cookies.get("jwt"),
    user: locals.user,
    // data,
  };
};

// export const actions: Actions = {
//   login: async ({ request }) => {
//     const formData = await request.formData();
//     const phone = formData.get("phone") as string;
//     const password = formData.get("password") as string;

//     const res = await fetch("http://localhost:8787/api/v1/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ phone, password }),
//     });

//     if (res.ok) {
//       return { success: true };
//     }

//     return { error: "Invalid credentials" };
//   },

//   logout: async () => {
//     await fetch("http://localhost:8787/api/v1/auth/logout", {
//       method: "POST",
//     });

//     return { success: true };
//   },
// };
