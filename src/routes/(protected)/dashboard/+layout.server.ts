import {redirect, type Actions, error} from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {baseUrl} from "$lib/utils/constants";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  try {
    const jwt = cookies.get('jwt');

    if (!jwt) {
      throw error(401, 'No authentication token found');
    }

    const statsResponse = await fetch(`${baseUrl}/api/v1/attendance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }
    });

    if (!statsResponse.ok) {
      const errorData = await statsResponse.json().catch(() => ({}));
      throw error(statsResponse.status, errorData.error || 'Failed to fetch stats');
    }

    const { data: stats } = await statsResponse.json();

    return {
      jwt: cookies.get("jwt"),
      user: locals.user,
      stats,
    };

  } catch (err) {
    // Handle specific error types
    if (err instanceof Error) {
      console.error('Load error:', err);
      throw error(500, err.message);
    }
    // Re-throw SvelteKit errors
    if (err) throw err;
    // Generic error
    throw error(500, 'An unexpected error occurred');
  }
};
