// // import type { RecipeFilter } from "@/types";
// // import { initialSummary } from "./helpers";
// // /**
// //  * Ensures the summary has the full Options structure, filling missing keys
// //  * with empty arrays from initialSummary and validating array types.
// //  */

// // export function ensureSummaryStructure(partialSummary: Partial<RecipeFilter> & { source?: Record<string, string[]> }): RecipeFilter {
// //     const flattened: Partial<RecipeFilter> = { ...partialSummary };

// //     // Flatten any existing `source` object
// //     if (partialSummary.source) {
// //         for (const key of Object.keys(partialSummary.source)) {
// //             const flatKey = `source.${key}` as keyof RecipeFilter;
// //             flattened[flatKey] = Array.isArray(partialSummary.source[key]) ? partialSummary.source[key] : initialSummary[flatKey];
// //         }
// //     }

// //     return Object.keys(initialSummary).reduce((acc, key) => {
// //         const typedKey = key as keyof RecipeFilter;
// //         acc[typedKey] = Array.isArray(flattened[typedKey]) ? flattened[typedKey] : initialSummary[typedKey];
// //         return acc;
// //     }, {} as RecipeFilter);
// // }

// import type { RecipeFilter } from "@/types";
// import { initialSummary } from "./helpers";

// /**
//  * Ensures the summary has the full Options structure, filling missing keys
//  * with empty arrays from initialSummary and flattening legacy source objects.
//  */
// export function ensureSummaryStructure(partialSummary: Partial<RecipeFilter> & { source?: Record<string, string[]> }): RecipeFilter {
//     const flattened: Partial<RecipeFilter> = { ...partialSummary };

//     // Legacy source key mapping
//     const legacySourceKeyMap: Record<string, keyof RecipeFilter> = {
//         http: "source.url",
//         url: "source.url",
//         book: "source.book",
//         title: "source.title",
//         author: "source.author",
//         where: "source.where",
//     };

//     // Flatten legacy `source` object if present
//     if (partialSummary.source) {
//         for (const [key, value] of Object.entries(partialSummary.source)) {
//             const mappedKey = legacySourceKeyMap[key];
//             if (!mappedKey) continue;

//             flattened[mappedKey] = Array.isArray(value) ? value : initialSummary[mappedKey];
//         }
//     }

//     // Ensure full structure using initialSummary as fallback
//     return Object.keys(initialSummary).reduce((acc, key) => {
//         const typedKey = key as keyof RecipeFilter;
//         acc[typedKey] = Array.isArray(flattened[typedKey]) ? flattened[typedKey] : initialSummary[typedKey];
//         return acc;
//     }, {} as RecipeFilter);
// }

// todo: tu jest mapowanie
// Legacy source key mapping
//     const legacySourceKeyMap: Record<string, keyof RecipeFilter> = {
//         http: "source.url",
//         url: "source.url",
//         book: "source.book",
//         title: "source.title",
//         author: "source.author",
//         where: "source.where",
//     };
// w przyszłości do usunięcia. Nie bardzo wiem dlaczego tak jest


import type { RecipeFilter } from "@/types";
import { initialSummary } from "./helpers";

/**
 * Ensures the summary has the full Options structure, filling missing keys
 * with empty arrays from initialSummary and flattening source objects.
 */
export function ensureSummaryStructure(partialSummary: Partial<RecipeFilter> & { source?: Record<string, string[]> }): RecipeFilter {
    const flattened: Partial<RecipeFilter> = { ...partialSummary };

    // Flatten source object fields to `source.*` keys if present
    if (partialSummary.source) {
        for (const [key, value] of Object.entries(partialSummary.source)) {
            const flatKey = `source.${key}` as keyof RecipeFilter;

            // Only accept known canonical keys
            if (flatKey in initialSummary) {
                flattened[flatKey] = Array.isArray(value) ? value : initialSummary[flatKey];
            }
        }
    }

    // Fill in missing keys with initialSummary defaults
    return Object.keys(initialSummary).reduce((acc, key) => {
        const typedKey = key as keyof RecipeFilter;
        acc[typedKey] = Array.isArray(flattened[typedKey]) ? flattened[typedKey] : initialSummary[typedKey];
        return acc;
    }, {} as RecipeFilter);
}
