import type { RecipeFilter } from "@/types";
import { client } from "../createClient";
import { INITIAL_SANITIZE_ISSUES, initialSummary } from "./helpers";
import { sanitizeSummary } from "./sanitizeSummary";
import { ensureSummaryStructure } from "./ensureSummaryStructure";
import { sortSummary } from "./sortSummary";
import { handleSanitizeIssues } from "./handleSanitizeIssues";

export interface SummaryResult {
    fullSummary: RecipeFilter;
    publicSummary: RecipeFilter;
    sanitizeIssues: string[];
}

export async function getOptions(): Promise<SummaryResult> {
    try {
        const query = `*[_type == "options"][0]{fullSummary, goodSummary}`;

        const raw = await client.fetch(query);
        console.log("rawSummary", raw);

        if (!raw) {
            console.warn("No summary document found, returning initialSummary");
            return {
                fullSummary: initialSummary,
                publicSummary: initialSummary,
                sanitizeIssues: INITIAL_SANITIZE_ISSUES,
            };
        }

        // Normalize structure
        const structuredFull = ensureSummaryStructure(raw.fullSummary);
        const structuredPublic = ensureSummaryStructure(raw.goodSummary);

        // Sanitize
        const { sanitizedSummary: sanitizedFull, sanitizeIssues: issuesFull } = sanitizeSummary(structuredFull);

        const { sanitizedSummary: sanitizedPublic, sanitizeIssues: issuesPublic } = sanitizeSummary(structuredPublic);

        const sanitizeIssues = [...issuesFull, ...issuesPublic];
        handleSanitizeIssues(sanitizeIssues);

        // Sort
        const fullSummary = sortSummary(sanitizedFull);
        const publicSummary = sortSummary(sanitizedPublic);

        

        return { fullSummary, publicSummary, sanitizeIssues };
    } catch (error) {
        console.error("Error fetching recipes summary:", error);
        return {
            fullSummary: initialSummary,
            publicSummary: initialSummary,
            sanitizeIssues: INITIAL_SANITIZE_ISSUES,
        };
    }
}
