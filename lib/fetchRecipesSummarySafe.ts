// Updated fetchRecipesSummarySafe function
import { getRecipesSummary } from "@/lib/getRecipesSummary";
import { cleanSummary } from "@/lib/cleanSummary"; // Adjust path as needed
import type { Options } from "@/types";

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
        const rawSummary = await getRecipesSummary();

        const { sanitizedSummary, faulty } = cleanSummary(rawSummary);
        console.log("sanitized", sanitizedSummary);

        if (faulty.length > 0) {
            console.warn("⚠️ Faulty values found in recipes summary:", faulty);
            return {
                summary: sanitizedSummary,
                error: "Niektóre dane zawierały błędy i zostały oczyszczone.",
            };
        }

        return { summary: sanitizedSummary, error: null };
    } catch (err) {
        console.error("❌ Failed to fetch recipes summary:", err);
        return {
            summary: {
                titles: [],
                cuisines: [],
                tags: [],
                dietaryRestrictions: [],
                products: [],
            },
            error: "Nie udało się pobrać podsumowania przepisów",
        };
    }
}
