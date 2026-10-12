import type { FilterState } from "@/models/filters";
import { buildQueryString } from "./buildQueryStrings";

export const FILTER_COOKIE_NAME = "cookbook_recipe_filters";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dni

export function saveAppliedFilters(filters: FilterState): void {
    if (typeof document === "undefined") return;

    const queryString = buildQueryString(filters);

    if (!queryString) {
        clearSavedFilters();
        return;
    }

    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    document.cookie = `${FILTER_COOKIE_NAME}=${encodeURIComponent(queryString)}` + `; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearSavedFilters(): void {
    if (typeof document === "undefined") return;

    document.cookie = `${FILTER_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
