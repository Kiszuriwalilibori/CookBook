import { getSummary } from "@/utils/getSummary";
import type { RecipeFilter } from "@/types";
import { initialSummary } from "@/utils/getSummary/helpers";

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
        const { summary, sanitizeIssues } = await getSummary();

        if (sanitizeIssues.length > 0) {
            console.warn("⚠️ Faulty values found in recipes summary:", sanitizeIssues);
            return {
                summary,
                error: "Niektóre dane zawierały błędy i zostały oczyszczone.",
            };
        }

        return { summary, error: null };
    } catch (err) {
        console.error("❌ Failed to fetch recipes summary:", err);
        return {
            summary: initialSummary,
            error: "Nie udało się pobrać podsumowania przepisów",
        };
    }
}

export default fetchSummary;
