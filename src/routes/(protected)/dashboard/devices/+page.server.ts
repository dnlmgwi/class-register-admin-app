import {baseUrl} from "$lib/utils/constants";
import type {PaginatedResult} from "$lib/utils/types/types";
import {cacheFetch} from "$lib/stores/cache";
import type {PageServerLoad} from './$types';
import type {DeviceDTO} from "$lib/domain/valueObjects/DeviceDTO";
import {createDeviceSchema} from "$lib/domain/validators/Device/createDeviceValidator";
import {fail, superValidate} from "sveltekit-superforms";
import {zod} from "sveltekit-superforms/adapters";
import {serverCacheFetch} from "$lib/stores/serverCache";
import {redirect, type Actions, error} from "@sveltejs/kit";
import {deleteDeviceSchema} from "$lib/domain/validators/Device/deleteDeviceValidator";
import type {AttendanceRegisterDTO} from "$lib/domain/valueObjects/AttendanceRegisterDTO";
import {createModuleSchema} from "$lib/domain/validators/Module/createModuleValidator";


export const load: PageServerLoad = async ({locals, url, fetch}) => {
    let page = url.searchParams.get("page");
    let limit = url.searchParams.get("limit");
    const {pathname} = url;

    const form = await superValidate(zod(createDeviceSchema));

    if (!locals.jwt) {
        throw error(401, 'Not authenticated');
    }

    const response = await fetch(`${baseUrl}/api/v1/device?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${locals.jwt}`,
            "Content-Type": "application/json",
        },
    });

    const {data} = await response.json() as PaginatedResult<DeviceDTO>;


    const devices = data.value;

    const meta = data.meta;
    return {
        form,
        devices,
        meta,
    };
}


export const actions: Actions = {
    // Create Device Action
    create: async ({request, locals, fetch}) => {
        const form = await superValidate(request, zod(createDeviceSchema));

        // Validate the form
        if (!form.valid) {
            return fail(400, {
                form,
                error: form.errors.name || 'Invalid form data'
            });
        }

        try {
            // Send a POST request to create a new device
            const response = await fetch(`${baseUrl}/api/v1/device`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${locals.jwt}`,
                },
                body: JSON.stringify({...form.data}),
            });

            // Handle API errors
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error?.issues?.[0]?.message || 'Failed to create device';
                return fail(response.status, {
                    form,
                    error: errorMessage
                });
            }

            // Return success response
            const result = await response.json();
            return {
                form,
                success: true,
                token: result.data // Return the token for the frontend
            };
        } catch (err) {
            // Handle unexpected errors
            return fail(500, {
                form,
                error: 'Failed to create device'
            });
        }
    },

    // Delete Device Action
    delete: async ({request, locals, fetch}) => {
        const form = await superValidate(request, zod(deleteDeviceSchema));

        // Validate the form
        if (!form.valid) {
            return fail(400, {
                form,
                error: form.errors.id || 'Invalid form data'
            });
        }

        try {
            // Send a DELETE request to delete the device
            const response = await fetch(`${baseUrl}/api/v1/device`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${locals.jwt}`,
                },
                body: JSON.stringify({...form.data}),
            });

            // Handle API errors
            const result = await response.json();
            if (!response.ok) {
                return fail(response.status, {
                    error: result.error
                });
            }

            // Return success response
            return {success: true, message: result.data};
        } catch (err) {
            // Handle unexpected errors
            return fail(500, {
                error: 'Failed to delete device'
            });
        }
    },

    // Enable Device Action
    enable: async ({request, locals, fetch}) => {
        const form = await superValidate(request, zod(deleteDeviceSchema));

        // Validate the form
        if (!form.valid) {
            return fail(400, {
                form,
                error: form.errors.id || 'Invalid form data'
            });
        }

        try {
            // Send a PUT request to enable the device
            const response = await fetch(`${baseUrl}/api/v1/device/enable`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${locals.jwt}`,
                },
                body: JSON.stringify({...form.data}),
            });

            // Handle API errors
            const result = await response.json();
            if (!response.ok) {
                return fail(response.status, {
                    error: result.error
                });
            }

            // Return success response
            return {success: true, message: result.data};
        } catch (err) {
            // Handle unexpected errors
            return fail(500, {
                error: 'Failed to enable device'
            });
        }
    },

    // Disable Device Action
    disable: async ({request, locals, fetch}) => {
        const form = await superValidate(request, zod(deleteDeviceSchema));

        // Validate the form
        if (!form.valid) {
            return fail(400, {
                form,
                error: form.errors.id || 'Invalid form data'
            });
        }

        try {
            // Send a PUT request to disable the device
            const response = await fetch(`${baseUrl}/api/v1/device/disable`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${locals.jwt}`,
                },
                body: JSON.stringify({...form.data}),
            });

            // Handle API errors
            const result = await response.json();
            if (!response.ok) {
                return fail(response.status, {
                    error: result.error
                });
            }

            // Return success response
            return {success: true, message: result.data};
        } catch (err) {
            // Handle unexpected errors
            return fail(500, {
                error: 'Failed to disable device'
            });
        }
    }
};