export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface RatingSummary {
    average: number;
    count: number;
}

import { createClient } from "@sanity/client";
import type { PatchRecipeRatingsInput, RecipeRating } from "../../types";
import { calculateRatingSummary, mergeRatings } from "./patchRecipeRating";

export const writeClient = createClient({
    projectId: "mextu0pu",
    dataset: "production",
    apiVersion: "2024-10-14",
    token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV",
    useCdn: false,
});

// ==================== GENEROWANIE OCEN ====================
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): string {
    const timestamp = randomInt(start.getTime(), end.getTime());
    return new Date(timestamp).toISOString();
}

function generateRatings(recipeTitle: string, minAvg = 4.2, maxAvg = 4.8): RecipeRating[] {
    const count = randomInt(40, 200);
    const ratings: RecipeRating[] = [];
    const startDate = new Date("2026-01-01T00:00:00Z");
    const endDate = new Date();

    for (let i = 1; i <= count; i++) {
        // 90% ocen 4-5, 10% niższych
        const ratingValue = Math.random() < 0.9 ? (randomInt(4, 5) as RatingValue) : (randomInt(1, 3) as RatingValue);

        ratings.push({
            rating: ratingValue,
            fingerprint: `fp_${recipeTitle.slice(0, 3).toLowerCase()}_${i}_${Math.random().toString(36).slice(2, 10)}`,
            updatedAt: randomDate(startDate, endDate),
            _key: crypto.randomUUID(),
        });
    }

    // Lekka korekta średniej, jeśli jest poza zakresem
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / count;

    if (avg < minAvg || avg > maxAvg) {
        const target = (minAvg + maxAvg) / 2;
        const factor = target / avg;

        ratings.forEach(r => {
            const newRating = Math.min(5, Math.max(1, Math.round(r.rating * factor))) as RatingValue;
            r.rating = newRating;
        });
    }

    return ratings;
}

// ==================== GŁÓWNA FUNKCJA ====================
export async function addFakeRatings(recipeTitle: string): Promise<void> {
    console.log(`\n🔄 Generowanie ocen dla: "${recipeTitle}"...`);

    const ratings = generateRatings(recipeTitle);
    const input: PatchRecipeRatingsInput = {
        recipeTitle,
        ratings,
    };

    await patchRecipeRatings(input);

    console.log(`✅ Gotowe! Dodano ${ratings.length} ocen dla "${recipeTitle}"`);
}

// ==================== FUNKCJA PATCH ====================
async function patchRecipeRatings(input: PatchRecipeRatingsInput): Promise<void> {
    const { recipeTitle, ratings: newRatings } = input;

    // Znajdź przepis
    const recipe = await writeClient.fetch<{ _id?: string }>(`*[_type == "recipe" && title == $title][0]{ _id }`, { title: recipeTitle });

    if (!recipe?._id) {
        throw new Error(`❌ Nie znaleziono przepisu: "${recipeTitle}"`);
    }

    // Pobierz istniejące oceny
    const existingData = await writeClient.fetch<{ ratings?: RecipeRating[] }>(`*[_type == "recipe" && _id == $recipeId][0]{ ratings }`, { recipeId: recipe._id });

    const existingRatings = existingData?.ratings || [];
    const mergedRatings = mergeRatings(existingRatings, newRatings);
    const newSummary = calculateRatingSummary(mergedRatings);

    await writeClient
        .patch(recipe._id)
        .set({
            ratings: mergedRatings,
            ratingSummary: newSummary,
        })
        .commit();

    console.log(`✅ Zaktualizowano "${recipeTitle}": ${newSummary.count} ocen, średnia: ${newSummary.average}⭐`);
}
