import { getSummary } from "@/lib/getSummary";
import type { RecipeFilter } from "@/types";
import { initialSummary } from "@/lib/getSummary/helpers";

/**
 * Fetches recipes summary from Sanity safely.
 * Ensures data is always valid, cleans faulty values,
 * and returns both summary and potential error message.
 */
export async function fetchSummary(): Promise<{
    summary: RecipeFilter;
    error: string | null;
}> {
    try {
        // const rawSummary = await getSummary();

        const { sanitizedSummary, sanitizeIssues } = await getSummary();
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

export default fetchSummary;
