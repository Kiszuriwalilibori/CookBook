import { FilterState } from "@/types";

export const buildQueryString = (filters: FilterState): string => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
            return;
        }

        if (typeof value === "boolean") {
            if (value) params.set(key, "true"); // only include when true
            return;
        }

        if (value && value !== "") {
            params.set(key, value);
        }
    });

    return params.toString();
};
