import { writable } from "svelte/store";

export const progress = writable(0);

export const serverProgress = writable(0);

export const accessToken = writable<string | null>(localStorage.getItem("accessToken") || null);

export const refreshToken = writable<string | null>(localStorage.getItem("refreshToken") || null);


accessToken.subscribe((token: string|null) => {
    if (token) {
        localStorage.setItem("accessToken", token);
    } else {
        localStorage.removeItem("accessToken");
    }
});

refreshToken.subscribe((token: string|null) => {
    if (token) {
        localStorage.setItem("refreshToken", token);
    } else {
        localStorage.removeItem("refreshToken");
    }
});