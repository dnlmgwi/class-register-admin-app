// lib/server/cache.ts
import { error } from "@sveltejs/kit";

// Use Map for server-side caching
const serverCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export const serverCacheFetch = async <T>(
    key: string,
    fetchCallback: () => Promise<Response>,
    forceRefresh: boolean = false
): Promise<T> => {
  const now = Date.now();
  const cached = serverCache.get(key);

  // Return cached data if valid and not forcing refresh
  if (!forceRefresh && cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data as T;
  }

  try {
    const response = await fetchCallback();

    if (!response.ok) {
      const errorData = await response.json();
      throw error(response.status, errorData);
    }

    const result = await response.json();

    // Update cache with new data and timestamp
    serverCache.set(key, {
      data: result,
      timestamp: now
    });

    return result as T;
  } catch (err) {
    console.error(`Cache fetch error for ${key}:`, err);
    throw error(err?.status || 500, err?.message || 'Failed to fetch data');
  }
};

export const invalidateServerCache = (pattern?: string) => {
  if (pattern) {
    // Delete entries matching the pattern
    for (const key of serverCache.keys()) {
      if (key.includes(pattern)) {
        serverCache.delete(key);
      }
    }
  } else {
    // Clear entire cache
    serverCache.clear();
  }
};

// Optional: Add cache monitoring functions
export const getCacheStats = () => ({
  size: serverCache.size,
  keys: Array.from(serverCache.keys()),
  entries: Array.from(serverCache.entries()).map(([key, { timestamp }]) => ({
    key,
    age: Date.now() - timestamp
  }))
});