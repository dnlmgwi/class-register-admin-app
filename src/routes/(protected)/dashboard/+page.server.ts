import { redirect, type Actions, error } from "@sveltejs/kit";
import type { PageServerLoad } from "../../auth/$types";
import { baseUrl } from "$lib/utils/constants";

export const actions: Actions = {
    logout: async ({ locals, cookies }) => {
        await fetch(`${baseUrl}/api/v1/auth/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookies.get("jwt")}`,
                "Content-Type": "application/json",
            },
            // credentials: "include",
        });

        locals.user = null;
        locals.jwt = null;

        // Clear the JWT cookie
        cookies.delete("jwt", { path: "/" });

        return redirect(302, "/auth/login");
    },
};