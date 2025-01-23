import { redirect, type Handle } from "@sveltejs/kit";
import type { User } from "./types";
import { baseUrl, nodeEnv } from "$lib/utils/constants";
import { jwtDecode } from "jwt-decode";

// Define protected routes and their required roles
const PROTECTED_ROUTES = {
  "/dashboard": ["lecturer", "admin", "student", "superadmin"],
};

// Define public routes that should be accessible without auth
const PUBLIC_ROUTES = ["/auth/signup", "/auth/login"];

async function getUserProfile(jwt: string): Promise<User | null> {
  try {
    const res = await fetch(`${baseUrl}/api/v1/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;
    const { data } = await res.json();
    return data as User;
  } catch (error) {
    return null;
  }
}

function isTokenExpired(decodedToken: { exp: number }): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationThreshold = 5 * 60; // 5 minutes buffer
  return decodedToken.exp < currentTime + expirationThreshold;
}

function clearAuthState(event: any) {
  event.locals.user = null;
  event.locals.jwt = null;
  event.cookies.set("jwt", "", {
    path: "/",
    maxAge: -1,
    httpOnly: true,
    secure: nodeEnv === "production",
    sameSite: "strict",
  });
}

function checkRouteAccess(pathname: string, userRole?: string): boolean {
  // Always allow access to public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return true;
  }

  // Check if the current path is protected
  const protectedRoute = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  );

  if (!protectedRoute) return true; // Not a protected route
  if (!userRole) return false; // No role for protected route

  const [, allowedRoles] = protectedRoute;
  return allowedRoles.includes(userRole);
}

export const handle: Handle = async ({ event, resolve }) => {
  // Get JWT from cookies first, then from locals as fallback
  const jwt = event.cookies.get("jwt") || event.locals.jwt;
  event.locals.jwt = jwt; // Ensure jwt is always in locals if present

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    event.url.pathname.startsWith(route)
  );

  // If accessing auth page with valid JWT, redirect to dashboard
  if (isPublicRoute && jwt) {
    try {
      const decodedToken = jwtDecode<{ exp: number; role: string }>(jwt);
      if (!isTokenExpired(decodedToken)) {
        const user = await getUserProfile(jwt);
        if (user) {
          throw redirect(303, "/dashboard");
        }
      }
    } catch (error) {

      if (error instanceof redirect) throw error;
      clearAuthState(event);
    }
  }

  if (jwt) {
    try {
      const decodedToken = jwtDecode<{ exp: number; role: string }>(jwt);

      if (isTokenExpired(decodedToken)) {
        clearAuthState(event);
        if (!isPublicRoute) {
          throw redirect(303, "/auth/login");
        }
      } else {
        // Set/refresh the cookie to maintain the session
        event.cookies.set("jwt", jwt, {
          path: "/",
          httpOnly: true,
          secure: nodeEnv === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 24 hours
        });
        const user = await getUserProfile(jwt);
        if (user) {
          event.locals.user = user;
          event.locals.jwt = jwt;

          // Check if user has access to the current route
          if (!checkRouteAccess(event.url.pathname, user.role)) {
            throw redirect(303, "/unauthorized");
          }
        } else {
          clearAuthState(event);
          throw redirect(303, "/auth/login");
        }
      }
    } catch (error) {
      clearAuthState(event);
      if (error instanceof redirect) throw error;
      throw redirect(303, "/auth/login");
    }
  }

  // Check if trying to access protected route without authentication
  if (!jwt && !isPublicRoute && !checkRouteAccess(event.url.pathname)) {
    throw redirect(303, "/auth/login");
  }

  // Add cache control headers for protected routes
  const response = await resolve(event);
  if (!isPublicRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
};
