import type { RecipeFilter } from "@/types";

export function sortSummary(summary: RecipeFilter): RecipeFilter {
    // True Polish alphabetical comparison:
    const sortFn = (a: string, b: string) => a.localeCompare(b, "pl", { sensitivity: "base" });

    const sorted: RecipeFilter = {} as RecipeFilter;

    for (const key of Object.keys(summary) as (keyof RecipeFilter)[]) {
        const value = summary[key];

        if (Array.isArray(value)) {
            sorted[key] = [...value].sort(sortFn);
        } else {
            sorted[key] = value;
        }
    }

    return sorted;
}
