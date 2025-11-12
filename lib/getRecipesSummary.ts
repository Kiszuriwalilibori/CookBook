import type { Options } from "@/types";
import { client } from "./createClient";
import { initialSummary } from "./cleanSummary/helpers";

/**
 * Fetches the preprocessed recipes summary document from Sanity.
 * The summary document is created and normalized by your API route,
 * so all arrays (titles, cuisines, tags, dietaryRestrictions, products)
 * are already lowercase, deduplicated, and sanitized.
 */
export async function getRecipesSummary(): Promise<Options> {
    try {
        // Fetch the single aggregated "recipesSummary" document
        const query = `*[_type == "recipesSummary"][0]{
			titles,
			cuisines,
			tags,
			dietaryRestrictions,
			products
		}`;

        const summary = await client.fetch(query);

        const safeSummary = Object.keys(initialSummary).reduce((acc, key) => {
            const typedKey = key as keyof Options;
            acc[typedKey] = Array.isArray(summary?.[typedKey]) ? summary[typedKey] : initialSummary[typedKey];
            return acc;
        }, {} as Options);

        return safeSummary;
    } catch (error) {
        console.error("Error fetching recipes summary:", error);
        // Fallback: return an empty summary structure
        return initialSummary;
    }
}
