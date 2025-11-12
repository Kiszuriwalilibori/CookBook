// Updated fetchRecipesSummarySafe function
import { getRecipesSummary } from "@/lib/getRecipesSummary";
// import { sanitizeSummary } from "@/lib/cleanSummary/sanitizeSummary"; // Adjust path as needed
import type { Options } from "@/types";
import { initialSummary } from "./cleanSummary/helpers";

/**
 * Fetches recipes summary from Sanity safely.
 * Ensures data is always valid, cleans faulty values,
 * and returns both summary and potential error message.
 */
export async function fetchRecipesSummarySafe(): Promise<{
    summary: Options;
    error: string | null;
}> {
    try {
        // const rawSummary = await getRecipesSummary();

        const { sanitizedSummary, sanitizeIssues } = await getRecipesSummary();
        // sanitizeSummary(rawSummary);

        if (sanitizeIssues.length > 0) {
            console.warn("⚠️ Faulty values found in recipes summary:", sanitizeIssues);
            return {
                summary: sanitizedSummary,
                error: "Niektóre dane zawierały błędy i zostały oczyszczone.",
            };
        }

        return { summary: sanitizedSummary, error: null };
    } catch (err) {
        console.error("❌ Failed to fetch recipes summary:", err);
        return {
            summary: initialSummary,
            error: "Nie udało się pobrać podsumowania przepisów",
        };
    }
}
