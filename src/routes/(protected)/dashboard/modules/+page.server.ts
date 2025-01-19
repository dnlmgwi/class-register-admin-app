// +page.server.ts
import { baseUrl } from "$lib/utils/constants";
import type { PaginatedResult } from "$lib/utils/types/types";
import type { ModuleDTO } from "$lib/domain/valueObjects/ModuleDTO";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { createModuleSchema } from "$lib/domain/validators/Module/createModuleValidator";
import {type Actions, error} from "@sveltejs/kit";
import type { PageServerLoad } from './$types';
import {createDeviceSchema} from "$lib/domain/validators/Device/createDeviceValidator";
import {fail} from "sveltekit-superforms";
import {deleteDeviceSchema} from "$lib/domain/validators/Device/deleteDeviceValidator";

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");

  if (!locals.jwt) {
    throw error(401, 'Not authenticated');
  }

  try {
    // Initialize the form with server-side validation
    const form = await superValidate(zod(createModuleSchema));

    // Fetch modules data
    const response = await fetch(
        `${baseUrl}/api/v1/module?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${locals.jwt}`,
            "Content-Type": "application/json",
          },
        }
    );

    if (!response.ok) {
      throw error(response.status, 'Failed to fetch modules data');
    }

    const { data } = await response.json() as PaginatedResult<ModuleDTO>;

    return {
      form,
      modules: data.value,
      meta: data.meta
    };
  } catch (err) {
    console.error('Server load error:', err);
    throw error(500, 'Failed to load modules data');
  }
};


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
      const response = await fetch(`${baseUrl}/api/v1/module`, {
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
      const response = await fetch(`${baseUrl}/api/v1/module`, {
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
      const response = await fetch(`${baseUrl}/api/v1/module/enable`, {
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
      const response = await fetch(`${baseUrl}/api/v1/module/disable`, {
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