import type { RecipeFilter } from "@/types";
import { initialSummary } from "./helpers";
/**
 * Ensures the summary has the full Options structure, filling missing keys
 * with empty arrays from initialSummary and validating array types.
 */

export function ensureSummaryStructure(partialSummary: Partial<RecipeFilter> & { source?: Record<string, string[]> }): RecipeFilter {
    const flattened: Partial<RecipeFilter> = { ...partialSummary };

    // Flatten any existing `source` object
    if (partialSummary.source) {
        for (const key of Object.keys(partialSummary.source)) {
            const flatKey = `source.${key}` as keyof RecipeFilter;
            flattened[flatKey] = Array.isArray(partialSummary.source[key]) ? partialSummary.source[key] : initialSummary[flatKey];
        }
    }

    return Object.keys(initialSummary).reduce((acc, key) => {
        const typedKey = key as keyof RecipeFilter;
        acc[typedKey] = Array.isArray(flattened[typedKey]) ? flattened[typedKey] : initialSummary[typedKey];
        return acc;
    }, {} as RecipeFilter);
}
