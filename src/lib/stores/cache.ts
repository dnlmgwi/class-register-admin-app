import { browser } from "$app/environment";
import { error } from "@sveltejs/kit";
import { get, writable } from "svelte/store";

export const cache = writable<Map<string, any>>(new Map());

export const cacheFetch = async <T>(
  key: string,
  fetchCallback: () => Promise<Response>,
  forceRefresh: boolean = false
): Promise<T> => {
  if (browser && !forceRefresh) {
    let cachedData = get(cache);
    if (cachedData.has(key)) {
      return cachedData.get(key) as T;
    }
  }

  const response = await fetchCallback();
  if (!response.ok) {
    const errorData = await response.json();
    throw error(response.status, errorData);
  }

  const result = await response.json();

  if (browser) {
    cache.update((currentCache) => {
      currentCache.set(key, result);
      return currentCache;
    });
  }

  return result as T;
};

export const invalidateCache = (key?: string) => {
  if (browser) {
    if (key) {
      cache.update((currentCache) => {
        currentCache.delete(key);
        return currentCache;
      });
    } else {
      cache.set(new Map());
    }
  }
};
