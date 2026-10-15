// import type { FilterState } from "@/models/filters";
// import { buildQueryString } from "./buildQueryStrings";

// export const FILTER_COOKIE_NAME = "cookbook_recipe_filters";

// export function saveAppliedFilters(filters: FilterState): void {
//     if (typeof document === "undefined") return;

//     const queryString = buildQueryString(filters);

//     if (!queryString) {
//         clearSavedFilters();
//         return;
//     }

//     const secure = window.location.protocol === "https:" ? "; Secure" : "";

//     document.cookie = `${FILTER_COOKIE_NAME}=${encodeURIComponent(queryString)}` + `; Path=/;SameSite=Lax${secure}`;
// }

// export function clearSavedFilters(): void {
//     if (typeof document === "undefined") return;

//     document.cookie = `${FILTER_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
// }

import type { FilterState } from "@/models/filters";
import { buildQueryString } from "./buildQueryStrings";

export const FILTER_COOKIE_NAME = "cookbook_recipe_filters";

export function saveAppliedFilters(filters: FilterState): void {
    if (typeof document === "undefined") return;

    const queryString = buildQueryString(filters);

    if (!queryString) {
        clearSavedFilters();
        return;
    }

    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie = `${FILTER_COOKIE_NAME}=${encodeURIComponent(queryString)}; Path=/; SameSite=Lax${secure}`;
}

export function clearSavedFilters(): void {
    if (typeof document === "undefined") return;

    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie = `${FILTER_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
