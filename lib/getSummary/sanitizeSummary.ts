import type { RecipeFilter } from "@/types";
import { CLEAN_SUMMARY_MESSAGES, INITIAL_SANITIZE_ISSUES, initialSummary } from "./helpers";

// 🟩 Centralized diagnostic message templates

/**
 * Cleans an object or array by removing faulty values
 * (null, undefined, or empty string) and collects issues for reporting.
 */
export function sanitizeSummary(summary: unknown): { sanitizedSummary: RecipeFilter; sanitizeIssues: string[] } {
    const faulties = new Set<unknown>([null, "", undefined]);
    const isFaulty = (value: unknown): boolean => faulties.has(value);

    const sanitizeIssues: string[] = INITIAL_SANITIZE_ISSUES;

    // 🧩 Handle null / non-object / array
    if (typeof summary !== "object" || summary === null || Array.isArray(summary)) {
        sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_AN_OBJECT(typeof summary));
        return { sanitizedSummary: { ...initialSummary }, sanitizeIssues };
    }

    const clean = (obj: unknown): unknown => {
        if (Array.isArray(obj)) {
            const cleanedArray: unknown[] = [];

            for (const value of obj) {
                if (isFaulty(value)) {
                    sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(value));
                    continue;
                }
                cleanedArray.push(clean(value));
            }

            return cleanedArray;
        }

        if (typeof obj === "object" && obj !== null) {
            const result: Partial<RecipeFilter> = {};

            const allowedKeys = Object.keys(initialSummary);
            const inputKeys = Object.keys(obj);

            // Detect unexpected keys
            for (const key of inputKeys) {
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

            for (const [key, value] of Object.entries(obj)) {
                if (key in initialSummary) {
                    const expected = initialSummary[key as keyof RecipeFilter];

                    if (Array.isArray(expected)) {
                        if (!Array.isArray(value)) {
                            sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD(key, typeof value));
                            result[key as keyof RecipeFilter] = [] as RecipeFilter[keyof RecipeFilter];
                            continue;
                        }
                    }

                    result[key as keyof RecipeFilter] = clean(value) as RecipeFilter[keyof RecipeFilter];
                }
            }
            return result;
        }

        return obj;
    };

    const sanitizedSummary = clean(summary) as RecipeFilter;
    return { sanitizedSummary, sanitizeIssues };
}
