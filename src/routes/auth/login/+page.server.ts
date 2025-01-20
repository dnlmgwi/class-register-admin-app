import {type Actions, fail, redirect} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import {baseUrl, nodeEnv} from "$lib/utils/constants";
import {superValidate} from 'sveltekit-superforms/server';
import {loginUserSchema} from "$lib/domain/validators/User/loginUserValidator";
import {zod} from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({locals}) => {
    if (locals.jwt) {
        return redirect(302, "/dashboard");
    }

    const form = await superValidate(zod(loginUserSchema));

    return {
        form
    };
};

export const actions: Actions = {
    login: async ({request, cookies, fetch, locals}) => {
        // First validate the form
        const form = await superValidate(request, zod(loginUserSchema));

        if (!form.valid) {
            return fail(400, {form});
        }


        const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone: form.data.phone,
                password: form.data.password
            }),
        });

        const result = await response.json();

        if (response.ok) {
            locals.jwt = result.data;

            cookies.set("jwt", result.data, {
                httpOnly: true,
                secure: nodeEnv === "production",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            });

            return {success: true};
        } else {
            return fail(response.status, {
                form,
                success: false,
                message: result.error || 'Invalid credentials'
            });
        }

    }
};