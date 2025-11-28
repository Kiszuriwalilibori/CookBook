// import type { RecipeFilter } from "@/types";
// import { client } from "../createClient";
// import { INITIAL_SANITIZE_ISSUES, initialSummary } from "./helpers";
// import { sanitizeSummary } from "./sanitizeSummary";
// import { ensureSummaryStructure } from "./ensureSummaryStructure";
// import { sortSummary } from "./sortSummary";
// import { handleSanitizeIssues } from "./handleSanitizeIssues";

// /**
//  * Sanitized summary result type.
//  */
// export interface SanitizedSummaryResult {
//     sanitizedSummary: RecipeFilter;
//     sanitizeIssues: string[]; // Matches the renamed field from sanitizeSummary
// }

// /**
//  * Fetches the preprocessed recipes summary document from Sanity.
//  * The summary document is created and normalized by your API route,
//  * so all arrays (titles, cuisines, tags, dietaryRestrictions, products)
//  * are already lowercase, deduplicated, and sanitized.
//  *
//  * Returns both the sanitized summary and any issues encountered during sanitization.
//  * All arrays are sorted alphabetically using Polish locale compare.
//  */
// export async function getSummary(): Promise<SanitizedSummaryResult> {
//     try {
//         // Fetch the single aggregated "summary" document
//         const query = `*[_type == "summary"][0]{
//             title,
//             cuisine,
//             tags,
//             dietary,
//             products,
//             source,
//         }`;

//         const rawSummary = await client.fetch(query);
//         const withStuctureSummary = ensureSummaryStructure(rawSummary);
//         const { sanitizedSummary: summary, sanitizeIssues } = sanitizeSummary(withStuctureSummary);
//         handleSanitizeIssues(sanitizeIssues);

//         const sortedSummary = sortSummary(summary);
//         console.log("summary just before return from getSummary", sortedSummary);
//         return { sanitizedSummary: sortedSummary, sanitizeIssues };
//     } catch (error) {
//         console.error("Error fetching recipes summary:", error);
//         // Fallback: return an empty summary structure with no issues
//         // Note: initialSummary arrays are already empty, so no sorting needed
//         return { sanitizedSummary: initialSummary, sanitizeIssues: INITIAL_SANITIZE_ISSUES };
//     }
// }

// export default getSummary;

import type { RecipeFilter } from "@/types";
import { client } from "../createClient";
import { INITIAL_SANITIZE_ISSUES, initialSummary } from "./helpers";
import { sanitizeSummary } from "./sanitizeSummary";
import { ensureSummaryStructure } from "./ensureSummaryStructure";
import { sortSummary } from "./sortSummary";
import { handleSanitizeIssues } from "./handleSanitizeIssues";
export interface SummaryResult {
    summary: RecipeFilter;
    sanitizeIssues: string[];
}

export async function getSummary(): Promise<SummaryResult> {
    try {
        const query = `*[_type == "summary"][0]{
            title,
            cuisine,
            tags,
            dietary,
            products, 
            source,
        }`;

        const rawSummary = await client.fetch(query);
        const withStructureSummary = ensureSummaryStructure(rawSummary);
        const { sanitizedSummary, sanitizeIssues } = sanitizeSummary(withStructureSummary);
        handleSanitizeIssues(sanitizeIssues);

        const summary = sortSummary(sanitizedSummary);
        console.log("summary just before return from getSummary", summary);

        return { summary, sanitizeIssues };
    } catch (error) {
        console.error("Error fetching recipes summary:", error);
        return { summary: initialSummary, sanitizeIssues: INITIAL_SANITIZE_ISSUES };
    }
}
