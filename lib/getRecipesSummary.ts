import type { Options } from "@/types";
import { client } from "./createClient";
import { INITIAL_SANITIZE_ISSUES, initialSummary } from "./cleanSummary/helpers";
import { sanitizeSummary } from "./cleanSummary/sanitizeSummary";

/**
 * Ensures the summary has the full Options structure, filling missing keys
 * with empty arrays from initialSummary and validating array types.
 */
function ensureSummaryStructure(partialSummary: Partial<Options>): Options {
    return Object.keys(initialSummary).reduce((acc, key) => {
        const typedKey = key as keyof Options;
        acc[typedKey] = Array.isArray(partialSummary?.[typedKey]) ? partialSummary[typedKey] : initialSummary[typedKey];
        return acc;
    }, {} as Options);
}

/**
 * Sanitized summary result type.
 */
export interface SanitizedSummaryResult {
    sanitizedSummary: Options;
    sanitizeIssues: string[]; // Matches the renamed field from sanitizeSummary
}

/**
 * Fetches the preprocessed recipes summary document from Sanity.
 * The summary document is created and normalized by your API route,
 * so all arrays (titles, cuisines, tags, dietaryRestrictions, products)
 * are already lowercase, deduplicated, and sanitized.
 *
 * Returns both the sanitized summary and any issues encountered during sanitization.
 * All arrays are sorted alphabetically using Polish locale compare.
 */
export async function getRecipesSummary(): Promise<SanitizedSummaryResult> {
    try {
        // Fetch the single aggregated "recipesSummary" document
        const query = `*[_type == "recipesSummary"][0]{
            titles,
            cuisines,
            tags,
            dietaryRestrictions,
            products
        }`;

        const rawSummary = await client.fetch(query);

        // Sanitize the fetched summary first (removes faulty values, collects issues)
        const { sanitizedSummary, sanitizeIssues } = sanitizeSummary(rawSummary);

        if (sanitizeIssues.length > 0) {
            console.warn("Issues detected and sanitized in fetched recipes summary:", sanitizeIssues);
        }

        // Ensure full structure with fallbacks for any remaining missing keys
        let summary = ensureSummaryStructure(sanitizedSummary);

        // Sort all arrays alphabetically using Polish locale compare
        const sortFn = (a: string, b: string) => a.localeCompare(b, "pl");
        summary = {
            ...summary,
            titles: [...summary.titles].sort(sortFn),
            cuisines: [...summary.cuisines].sort(sortFn),
            tags: [...summary.tags].sort(sortFn),
            dietaryRestrictions: [...summary.dietaryRestrictions].sort(sortFn),
            products: [...summary.products].sort(sortFn),
        };

        return { sanitizedSummary: summary, sanitizeIssues };
    } catch (error) {
        console.error("Error fetching recipes summary:", error);
        // Fallback: return an empty summary structure with no issues
        // Note: initialSummary arrays are already empty, so no sorting needed
        return { sanitizedSummary: initialSummary, sanitizeIssues: INITIAL_SANITIZE_ISSUES };
    }
}
