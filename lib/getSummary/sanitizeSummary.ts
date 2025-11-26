// import type { RecipeFilter } from "@/types";
// import { CLEAN_SUMMARY_MESSAGES, INITIAL_SANITIZE_ISSUES, initialSummary } from "./helpers";

// // 🟩 Centralized diagnostic message templates

// /**
//  * Cleans an object or array by removing faulty values
//  * (null, undefined, or empty string) and collects issues for reporting.
//  */
// export function sanitizeSummary(summary: unknown): { sanitizedSummary: RecipeFilter; sanitizeIssues: string[] } {
//     const faulties = new Set<unknown>([null, "", undefined]);
//     const isFaulty = (value: unknown): boolean => faulties.has(value);

//     const sanitizeIssues: string[] = INITIAL_SANITIZE_ISSUES;

//     // 🧩 Handle null / non-object / array
//     if (typeof summary !== "object" || summary === null || Array.isArray(summary)) {
//         sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_AN_OBJECT(typeof summary));
//         return { sanitizedSummary: { ...initialSummary }, sanitizeIssues };
//     }

//     const clean = (obj: unknown): unknown => {
//         if (Array.isArray(obj)) {
//             const cleanedArray: unknown[] = [];

//             for (const value of obj) {
//                 if (isFaulty(value)) {
//                     sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(value));
//                     continue;
//                 }
//                 cleanedArray.push(clean(value));
//             }

//             return cleanedArray;
//         }

//         if (typeof obj === "object" && obj !== null) {
//             const result: Partial<RecipeFilter> = {};

//             const allowedKeys = Object.keys(initialSummary);
//             const inputKeys = Object.keys(obj);

//             // Detect unexpected keys
//             for (const key of inputKeys) {
//                 if (!allowedKeys.includes(key)) {
//                     sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.UNEXPECTED_FIELD(key));
//                 }
//             }

//             // Detect missing keys
//             for (const key of allowedKeys) {
//                 if (!(key in obj)) {
//                     sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD(key));
//                 }
//             }

//             for (const [key, value] of Object.entries(obj)) {
//                 if (key in initialSummary) {
//                     const expected = initialSummary[key as keyof RecipeFilter];

//                     if (Array.isArray(expected)) {
//                         if (!Array.isArray(value)) {
//                             sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD(key, typeof value));
//                             result[key as keyof RecipeFilter] = [] as RecipeFilter[keyof RecipeFilter];
//                             continue;
//                         }
//                     }

//                     result[key as keyof RecipeFilter] = clean(value) as RecipeFilter[keyof RecipeFilter];
//                 }
//             }
//             return result;
//         }

//         return obj;
//     };

//     const sanitizedSummary = clean(summary) as RecipeFilter;
//     return { sanitizedSummary, sanitizeIssues };
// }

// // File: /lib/getSummary/sanitizeSummary.ts
// import type { RecipeFilter } from "@/types";
// import { CLEAN_SUMMARY_MESSAGES, INITIAL_SANITIZE_ISSUES, initialSummary } from "./helpers";

// /**
//  * Sanitizes a summary object, ensuring all fields exist, are arrays of strings,
//  * and collects issues for reporting.
//  */
// export function sanitizeSummary(summary: unknown): { sanitizedSummary: RecipeFilter; sanitizeIssues: string[] } {
//     const sanitizeIssues: string[] = [...INITIAL_SANITIZE_ISSUES];

//     // If the input is not an object or is null/array, return initial summary
//     if (typeof summary !== "object" || summary === null || Array.isArray(summary)) {
//         sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_AN_OBJECT(typeof summary));
//         return { sanitizedSummary: { ...initialSummary }, sanitizeIssues };
//     }

//     const obj = summary as Record<string, unknown>;
//     const result: Partial<RecipeFilter> = {};

//     // Dynamically iterate over all FilterableRecipeKeys
//     const allowedKeys: (keyof RecipeFilter)[] = Object.keys(initialSummary) as (keyof RecipeFilter)[];

//     for (const key of allowedKeys) {
//         const value = obj[key];

//         // If missing or null/undefined, set as empty array
//         if (value === undefined || value === null) {
//             result[key] = [];
//             continue;
//         }

//         // If not an array, report and set as empty array
//         if (!Array.isArray(value)) {
//             sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD(key, typeof value));
//             result[key] = [];
//             continue;
//         }

//         // Keep only valid strings, trimming whitespace
//         const cleanedArray: string[] = [];
//         for (const item of value) {
//             if (typeof item !== "string") {
//                 sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(item));
//                 continue;
//             }
//             const trimmed = item.trim();
//             if (trimmed === "") {
//                 sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(item));
//                 continue;
//             }
//             cleanedArray.push(trimmed);
//         }

//         result[key] = cleanedArray;
//     }

//     return { sanitizedSummary: result as RecipeFilter, sanitizeIssues };
// }








































































import type { RecipeFilter } from "@/types";
import { CLEAN_SUMMARY_MESSAGES, INITIAL_SANITIZE_ISSUES, initialSummary } from "./helpers";

export function sanitizeSummary(summary: unknown): { sanitizedSummary: RecipeFilter; sanitizeIssues: string[] } {
    const faulties = new Set<unknown>([null, "", undefined]);
    const sanitizeIssues: string[] = [...INITIAL_SANITIZE_ISSUES];

    const isFaulty = (value: unknown): boolean => faulties.has(value);

    if (typeof summary !== "object" || summary === null || Array.isArray(summary)) {
        sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_AN_OBJECT(typeof summary));
        return { sanitizedSummary: { ...initialSummary }, sanitizeIssues };
    }

    const obj = summary as Record<string, unknown>;
    const result: Partial<RecipeFilter> = {};

    const allowedKeys = Object.keys(initialSummary);

    // Detect unexpected keys
    for (const key of Object.keys(obj)) {
        if (!allowedKeys.includes(key)) {
            sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.UNEXPECTED_FIELD(key));
        }
    }

    // Detect missing keys
    for (const key of allowedKeys) {
        if (!(key in obj)) {
            sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD(key));
        }
    }

    // Clean each allowed key
    for (const key of allowedKeys) {
        const value = obj[key];

        if (Array.isArray(initialSummary[key as keyof RecipeFilter])) {
            if (!Array.isArray(value)) {
                sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD(key, typeof value));
                result[key as keyof RecipeFilter] = [] as RecipeFilter[keyof RecipeFilter];
                continue;
            }

            // Filter faulty values
            const cleanedArray = value.filter(v => !isFaulty(v)) as string[];
            for (const v of value) {
                if (isFaulty(v)) sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(v));
            }

            result[key as keyof RecipeFilter] = cleanedArray;
        }
    }

    return { sanitizedSummary: result as RecipeFilter, sanitizeIssues };
}
