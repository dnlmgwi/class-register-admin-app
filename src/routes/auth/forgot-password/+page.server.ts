import {redirect, type Actions, fail} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import {baseUrl, nodeEnv} from "$lib/utils/constants";
import {superValidate} from 'sveltekit-superforms/server';
import {loginUserSchema} from "$lib/domain/validators/User/loginUserValidator";
import {zod} from "sveltekit-superforms/adapters";
import {forgotPasswordSchema} from "$lib/domain/validators/User/forgotPasswordValidator";

export const load: PageServerLoad = async ({locals}) => {
    if (locals.jwt) {
        throw redirect(302, "/dashboard");
    }

    const form = await superValidate(zod(forgotPasswordSchema));

    return {
        form
    };
};

export const actions: Actions = {
    default: async ({request, cookies, fetch, locals}) => {
        // First validate the form
        const form = await superValidate(request, zod(forgotPasswordSchema));

        if (!form.valid) {
            return fail(400, {form});
        }

        console.log(form);

        const response = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: form.data.email,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            return {
                form, success: true
            };
        } else {
            return fail(response.status, {
                form,
                success: false,
                message: result.error || 'Invalid Email Provided'
            });
        }


    }
};
