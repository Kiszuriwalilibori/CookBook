import { useAdminStore } from "@/stores";
import { getOptions } from "./getOptions";
import type { RecipeFilter } from "@/types";
import { initialSummary } from "./getOptions/helpers";


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
        const isAdminLogged = useAdminStore.getState().isAdminLogged;

        const { fullSummary, publicSummary, sanitizeIssues } = await getOptions();

        // Select summary depending on admin mode
        const effectiveSummary = isAdminLogged ? fullSummary : publicSummary;

        // Warn about sanitize issues if any
        if (sanitizeIssues.length > 0) {
            console.warn("⚠️ Faulty values found in recipes summary:", sanitizeIssues);
            return {
                summary: effectiveSummary,
                error: "Niektóre dane zawierały błędy i zostały oczyszczone.",
            };
        }

        return { summary: effectiveSummary, error: null };
    } catch (err) {
        console.error("❌ Failed to fetch recipes summary:", err);
        return {
            summary: initialSummary,
            error: "Nie udało się pobrać podsumowania przepisów",
        };
    }
}

export default fetchSummary;
