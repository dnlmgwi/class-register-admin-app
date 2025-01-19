import { redirect, type Actions, error } from "@sveltejs/kit";
import type { PageServerLoad } from "../../auth/$types";
import { baseUrl } from "$lib/utils/constants";

export const actions: Actions = {
    logout: async ({ cookies, fetch, locals }) => {
        try {
            const jwt = cookies.get('jwt');

            if (jwt) {
                try {
                    await fetch(`${baseUrl}/api/v1/auth/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${jwt}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.error('Logout API error:', error);
                    // Continue with logout even if API call fails
                }
            }

            // Clear cookie
            cookies.set('jwt', '', {
                path: '/',
                expires: new Date(0)
            });

            // Clear locals
            locals.user = null;
            locals.jwt = null;

            // Return success status for client handling
            return {
                success: true
            };
        } catch (err) {
            console.error('Logout error:', err);
            return {
                success: true // Still return success to ensure logout
            };
        }
    }
};