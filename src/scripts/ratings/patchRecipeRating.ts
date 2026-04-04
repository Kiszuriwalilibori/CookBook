import { createClient } from "@sanity/client";
import type { PatchRecipeRatingsInput, RecipeRating, RatingSummary } from "../../types";

export const writeClient = createClient({
    projectId: "mextu0pu", // <--- hardkodowane
    dataset: "production",
    apiVersion: "2024-10-14",
    token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV", // <--- hardkodowane
    useCdn: false, // zawsze false w skryptach
});

/**
 * Calculates rating summary from array of ratings
 */
export function calculateRatingSummary(ratings: RecipeRating[]): RatingSummary {
    if (ratings.length === 0) {
        return { average: 0, count: 0 };
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = parseFloat((sum / ratings.length).toFixed(2));

    return {
        average,
        count: ratings.length,
    };
}

/**
 * Merges existing ratings with new ratings, replacing by fingerprint
 * Returns merged array with updated timestamps
 */

function generateKey(): string {
    return crypto.randomUUID();
}

export function mergeRatings(existingRatings: RecipeRating[], newRatings: RecipeRating[]): RecipeRating[] {
    const ratingsMap = new Map(existingRatings.map(r => [r.fingerprint, r]));

    newRatings.forEach(newRating => {
        ratingsMap.set(newRating.fingerprint, {
            ...newRating,
            _key: generateKey(),
        });
    });

    return Array.from(ratingsMap.values());
}

/**
 * Patches a recipe document with new ratings and updates rating summary
 *
 * Logic:
 * 1. If recipe has existing ratings, merge them with new ratings (no duplicates by fingerprint)
 * 2. If recipe has no ratings, add the new ratings
 * 3. After updating ratings, recalculate and update ratingSummary (average and count)
 */
export async function patchRecipeRatings(input: PatchRecipeRatingsInput): Promise<void> {
    const { recipeTitle, ratings: newRatings } = input;

    // 1. Find recipe by title
    const recipeQuery = `*[_type == "recipe" && title == $title][0]{ _id }`;

    const recipe = await writeClient.fetch<{ _id?: string }>(recipeQuery, {
        title: recipeTitle,
    });

    if (!recipe?._id) {
        throw new Error(`❌ Nie znaleziono przepisu: "${recipeTitle}"`);
    }

    // 2. Fetch existing ratings for this recipe
    const existingRatingsQuery = `*[_type == "recipe" && _id == $recipeId][0]{ ratings }`;

    const existingData = await writeClient.fetch<{ ratings?: RecipeRating[] }>(existingRatingsQuery, { recipeId: recipe._id });

    // 3. Merge ratings (handles both new and existing)
    const existingRatings = existingData?.ratings || [];
    const mergedRatings = mergeRatings(existingRatings, newRatings);

    // 4. Calculate new summary
    const newSummary = calculateRatingSummary(mergedRatings);

    // 5. Update recipe with merged ratings and new summary
    await writeClient
        .patch(recipe._id)
        .set({
            ratings: mergedRatings,
            ratingSummary: newSummary,
        })
        .commit();

    console.log(`✅ Zaktualizowano ratings dla "${recipeTitle}": ${newSummary.count} ocen, średnia: ${newSummary.average}⭐`);
}
