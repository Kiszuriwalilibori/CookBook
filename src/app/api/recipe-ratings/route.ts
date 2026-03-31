import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/utils";
import type { RatingPayload, RecipeRating } from "@/types/recipeRatings";

// Helper do generowania unikalnego _key
function generateKey() {
    return Math.random().toString(36).substring(2, 10);
}

export async function POST(req: NextRequest) {
    try {
        const { recipeId, rating, fingerprint, overwrite }: RatingPayload = await req.json();

        if (!recipeId || !rating || !fingerprint) {
            return NextResponse.json({ error: "Niepoprawne dane" }, { status: 400 });
        }

        // 1️⃣ Pobierz istniejące ratings dla przepisu
        const recipe = await writeClient.fetch<{ _id: string; ratings?: RecipeRating[] }>('*[_type == "recipe" && _id == $id][0]{ _id, ratings }', { id: recipeId });

        if (!recipe?._id) {
            return NextResponse.json({ error: "Nie znaleziono przepisu" }, { status: 404 });
        }

        const existingRatings = recipe.ratings || [];
        const existingRating = existingRatings.find(r => r.fingerprint === fingerprint);

        // 2️⃣ Obsługa przypadku nowa ocena = stara ocena
        if (existingRating && existingRating.rating === rating) {
            return NextResponse.json({ status: "noChange", existingRating, message: "Nie zmieniono oceny" });
        }

        // 3️⃣ Obsługa konfliktu: różna ocena, brak overwrite
        if (existingRating && !overwrite) {
            return NextResponse.json({ status: "exists", existingRating }, { status: 409 });
        }

        // 4️⃣ Przygotuj nową ocenę lub nadpisanie
        const updatedAt = new Date().toISOString();
        let mergedRatings: RecipeRating[];

        if (existingRating && overwrite) {
            // Nadpisujemy starą ocenę (zachowując _key)
            mergedRatings = existingRatings.map(r => (r.fingerprint === fingerprint ? { ...r, rating, updatedAt } : r));
        } else {
            // Nowa ocena
            const newRating: RecipeRating = {
                _key: generateKey(),
                rating,
                fingerprint,
                updatedAt,
            };
            mergedRatings = [...existingRatings, newRating];
        }

        // 5️⃣ Przelicz ratingSummary
        const count = mergedRatings.length;
        const average = mergedRatings.reduce((acc, r) => acc + r.rating, 0) / count;
        const ratingSummary = { average: parseFloat(average.toFixed(2)), count };

        // 6️⃣ Patch w Sanity
        await writeClient.patch(recipe._id).set({ ratings: mergedRatings, ratingSummary }).commit();

        return NextResponse.json({ status: "ok", ratingSummary, ratingSent: rating });
    } catch (err) {
        console.error("Error saving rating:", err);
        return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
    }
}
