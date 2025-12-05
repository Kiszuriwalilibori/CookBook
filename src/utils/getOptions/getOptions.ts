import type { RecipeFilter } from "@/types";
import { client } from "../createClient";
import { INITIAL_SANITIZE_ISSUES, initialSummary } from "./helpers";
import { sanitizeSummary } from "./sanitizeSummary";
import { ensureSummaryStructure } from "./ensureSummaryStructure";
import { sortSummary } from "./sortSummary";
import { handleSanitizeIssues } from "./handleSanitizeIssues";

export interface SummaryResult {
    summary: RecipeFilter;
    publicSummary:RecipeFilter; // only fullSummary returned
    sanitizeIssues: string[];
}

export async function getOptions(): Promise<SummaryResult> {
    try {
        const query = `*[_type == "options"][0]{fullSummary, goodSummary}`;

        // Fetch the summary document
        const rawSummary = await client.fetch(query);
console.log("rawSummary", rawSummary);
        if (!rawSummary) {
            console.warn("No summary document found, returning initialSummary");
            return { summary: initialSummary, publicSummary: initialSummary, sanitizeIssues: INITIAL_SANITIZE_ISSUES };
        }

        // Ensure both fullSummary and goodSummary have the correct structure
        const withStructureFull = ensureSummaryStructure(rawSummary.fullSummary);
        const withStructureGood = ensureSummaryStructure(rawSummary.goodSummary);

        // Sanitize both versions
        const { sanitizedSummary: sanitizedFull, sanitizeIssues: issuesFull } = sanitizeSummary(withStructureFull);
        const { sanitizedSummary: sanitizedGood, sanitizeIssues: issuesGood } = sanitizeSummary(withStructureGood);

        // Combine sanitize issues for logging
        const sanitizeIssues = [...issuesFull, ...issuesGood];
        handleSanitizeIssues(sanitizeIssues);

        // Sort both summaries
        const sortedFull = sortSummary(sanitizedFull);
        const sortedGood = sortSummary(sanitizedGood);

        // Console log both versions
        console.log("Full Summary:", sortedFull);
        console.log("Good/Acceptable Summary:", sortedGood);

        // Return only the fullSummary to preserve existing API
        return { summary: sortedFull, publicSummary: sortedGood, sanitizeIssues };
    } catch (error) {
        console.error("Error fetching recipes summary:", error);
        return { summary: initialSummary, publicSummary: initialSummary, sanitizeIssues: INITIAL_SANITIZE_ISSUES };
    }
}
