import { writable } from "svelte/store";

const inactiveSession = writable(false);

const tokenExpired = writable(false);

export { inactiveSession, tokenExpired };
