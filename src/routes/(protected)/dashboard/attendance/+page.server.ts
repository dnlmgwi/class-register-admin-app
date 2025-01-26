// +page.server.ts
import { baseUrl } from "$lib/utils/constants";
import type { PaginatedResult } from "$lib/utils/types/types";
import type { AttendanceRegisterDTO } from "$lib/domain/valueObjects/AttendanceRegisterDTO";
import type { ModuleDTO } from "$lib/domain/valueObjects/ModuleDTO";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { isAuthorized } from "$lib/utils/utilFunc";

export const load: PageServerLoad = async ({ locals, url, fetch }) => {
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");

  if (!locals.jwt) {
    throw error(401, "Not authenticated");
  }

  // Check authorization
  const isAdmin = await isAuthorized(locals.user);

  try {
    // Fetch attendance data
    const attendanceResponse = await fetch(
      `${baseUrl}/api/v1/attendance?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${locals.jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!attendanceResponse.ok) {
      throw error(attendanceResponse.status, "Failed to fetch attendance data");
    }

    // Fetch modules data
    const modulesResponse = await fetch(`${baseUrl}/api/v1/module`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${locals.jwt}`,
      },
    });

    if (!modulesResponse.ok) {
      throw error(modulesResponse.status, "Failed to fetch modules data");
    }

    const { data: attendanceList } =
      (await attendanceResponse.json()) as PaginatedResult<AttendanceRegisterDTO>;
    const { data: moduleData } =
      (await modulesResponse.json()) as PaginatedResult<ModuleDTO>;

    return {
      modules: moduleData.value,
      modulesMeta: moduleData.meta,
      attendance: attendanceList.value,
      meta: attendanceList.meta,
      unauthorized: !isAdmin,
    };
  } catch (err) {
    console.error("Server load error:", err);
    throw error(500, "Failed to load data");
  }
};
