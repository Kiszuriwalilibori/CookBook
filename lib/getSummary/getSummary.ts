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

        return { summary, sanitizeIssues };
    } catch (error) {
        console.error("Error fetching recipes summary:", error);
        return { summary: initialSummary, sanitizeIssues: INITIAL_SANITIZE_ISSUES };
    }
}
