import {redirect, type Actions} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import {baseUrl, nodeEnv} from "$lib/utils/constants";
import {superValidate} from 'sveltekit-superforms/server';
import {loginUserSchema} from "$lib/domain/validators/User/loginUserValidator";
import {zod} from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({locals}) => {
    if (locals.jwt) {
        throw redirect(302, "/dashboard");
    }

    const form = await superValidate(zod(loginUserSchema));

    return {
        form
    };
};

export const actions: Actions = {
    login: async ({request, cookies, fetch, locals}) => {
        const formData = await request.formData();
        const phone = formData.get("phone") as string;
        const password = formData.get("password") as string;

        const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({phone, password}),
        });

        if (response.ok) {
            const {data} = await response.json();

            console.log(data)

            locals.jwt = data;

            cookies.set("jwt", data, {
                httpOnly: true,
                secure: nodeEnv === "production",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            });

            return {success: true};
        }
        return {success: false};
    }
};
