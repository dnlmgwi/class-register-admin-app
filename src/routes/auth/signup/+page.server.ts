import {redirect, fail, type Actions} from "@sveltejs/kit";
import type {PageServerLoad} from "./$types";
import {baseUrl, nodeEnv} from "$lib/utils/constants";
import {superValidate} from 'sveltekit-superforms/server';
import {zod} from 'sveltekit-superforms/adapters';
import {createUserSchema} from '$lib/domain/validators/User/createUserValidator';
import {createStudentSchema} from '$lib/domain/validators/User/createStudentValidator';

export const load: PageServerLoad = async (event) => {
    // Redirect if already authenticated
    if (event.locals.jwt) {
        return redirect(302, "/dashboard");
    }

    // Initialize both forms with zod adapter
    const form = await superValidate(zod(createUserSchema));
    const studentForm = await superValidate(zod(createStudentSchema));

    return {
        form,
        studentForm
    };
};

export const actions = {
    staff: async ({request, fetch}) => {
        const form = await superValidate(request, zod(createUserSchema));

        if (!form.valid) {
            return fail(400, {form});
        }

        const response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form.data),
        });

        const result = await response.json();

        if (!response.ok) {
            return fail(response.status, {
                form,
                error: result.error || 'Signup failed'
            });
        }

        return redirect(303, '/auth/login');

    },
    student: async ({request, fetch}) => {
        const form = await superValidate(request, zod(createUserSchema));

        if (!form.valid) {
            return fail(400, {form});
        }

        const response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form.data),
        });

        const result = await response.json();

        if (!response.ok) {
            return fail(response.status, {
                form,
                error: result.error || 'Signup failed'
            });
        }

        return redirect(303, '/auth/login');

    }
} satisfies Actions;