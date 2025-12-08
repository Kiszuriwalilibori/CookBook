
import type { RecipeFilter } from "@/types";
import { CLEAN_SUMMARY_MESSAGES, INITIAL_SANITIZE_ISSUES, initialSummary } from "./helpers";

/**
 * Clean and normalize the AI-generated summary into a valid `RecipeFilter`.
 */
export function sanitizeSummary(summary: unknown): { sanitizedSummary: RecipeFilter; sanitizeIssues: string[] } {
    const faulties = new Set<unknown>([null, "", undefined]);
    const sanitizeIssues: string[] = [...INITIAL_SANITIZE_ISSUES];

    const isFaulty = (value: unknown): boolean => faulties.has(value);

    // SUMMARY MUST BE AN OBJECT
    if (typeof summary !== "object" || summary === null || Array.isArray(summary)) {
        sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_AN_OBJECT(typeof summary));
        return {
            sanitizedSummary: { ...initialSummary },
            sanitizeIssues,
        };
    }

    const obj = { ...summary } as Record<string, unknown>;
    const allowedKeys = Object.keys(initialSummary);

    // -------------------------------------------------------
    // 1) FLATTEN THE NESTED `source` OBJECT INTO `source.*`
    // -------------------------------------------------------
    if ("source" in obj && obj.source && typeof obj.source === "object" && !Array.isArray(obj.source)) {
        const src = obj.source as Record<string, unknown>;
        const sourceKeys = ["url", "book", "title", "author", "where"] as const;

        for (const key of sourceKeys) {
            const flatKey = `source.${key}` as keyof RecipeFilter;

            // Do not overwrite user-provided flattened fields
            if (flatKey in obj) continue;

            const raw = src[key];

            if (Array.isArray(raw)) {
                obj[flatKey] = raw.filter(v => typeof v === "string" && !isFaulty(v));
            } else {
                obj[flatKey] = [];
            }
        }
    }

    // -------------------------------------------------------
    // 2) DETECT UNEXPECTED FIELDS
    // -------------------------------------------------------
    for (const key of Object.keys(obj)) {
        if (!allowedKeys.includes(key)) {
            sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.UNEXPECTED_FIELD(key));
        }
    }

    // -------------------------------------------------------
    // 3) DETECT MISSING FIELDS
    // -------------------------------------------------------
    for (const key of allowedKeys) {
        if (!(key in obj)) {
            sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD(key));
        }
    }

    // -------------------------------------------------------
    // 4) CLEAN VALUES → ENSURE PROPER ARRAY OF STRINGS
    // -------------------------------------------------------
    const result: Partial<RecipeFilter> = {};

    for (const key of allowedKeys) {
        const value = obj[key];

        // Every RecipeFilter field is an array<string>
        if (!Array.isArray(value)) {
            sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD(key, typeof value));
            result[key as keyof RecipeFilter] = [];
            continue;
        }

        const cleaned = value.filter(v => {
            const ok = typeof v === "string" && !isFaulty(v);
            if (!ok) sanitizeIssues.push(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(v));
            return ok;
        });

        result[key as keyof RecipeFilter] = cleaned;
    }

    // -------------------------------------------------------
    // 5) RETURN FINAL RESULT
    // -------------------------------------------------------
    return {
        sanitizedSummary: result as RecipeFilter,
        sanitizeIssues,
    };
}
