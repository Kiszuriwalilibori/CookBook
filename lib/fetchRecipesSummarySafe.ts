import { getRecipesSummary } from "@/lib/getRecipesSummary";
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
        const data = await getRecipesSummary();

        // helper to define what counts as faulty
        const isFaulty = (v: unknown): boolean => v === null || v === undefined || v === "";

        // recursively clean and collect faulty values
        const faulty: unknown[] = [];
        const clean = (obj: unknown): unknown => {
            if (Array.isArray(obj)) {
                return obj
                    .filter(v => {
                        const bad = isFaulty(v);
                        if (bad) faulty.push(v);
                        return !bad;
                    })
                    .map(clean);
            }
            if (typeof obj === "object" && obj !== null) {
                return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, clean(v)]));
            }
            return obj;
        };

        const sanitized = clean(data) as Options;
        console.log("sanitized", sanitized);

        if (faulty.length > 0) {
            console.warn("⚠️ Faulty values found in recipes summary:", faulty);
            return {
                summary: sanitized,
                error: "Niektóre dane zawierały błędy i zostały oczyszczone.",
            };
        }

        return { summary: sanitized, error: null };
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
