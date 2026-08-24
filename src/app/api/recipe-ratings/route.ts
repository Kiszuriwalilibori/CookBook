import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/utils";
import { client } from "@/utils";
import { ApiError, apiErrorResponse } from "@/models/apiResponse";
import type { RatingPayload, RatingSummary, RecipeRating } from "@/types/recipeRatings";

// Helper do generowania unikalnego _key
function generateKey() {
    return Math.random().toString(36).substring(2, 10);
}

// async function parseBody(req: NextRequest): Promise<RatingPayload> {
//     try {
//         return await req.json();
//     } catch {
//         throw new ApiError("INVALID_JSON", "Nieprawidłowy format JSON", 400);
//     }
// }

export async function POST(req: NextRequest) {
    try {
        const { recipeId, rating, fingerprint, overwrite }: RatingPayload = await req.json();

        if (!recipeId) {
            throw new ApiError("MISSING_RECIPE_ID", "Brak Id przepisu", 400);
        }

        if (!rating) {
            throw new ApiError("MISSING_RATING", "Brak oceny", 400);
        }

        if (!fingerprint) {
            throw new ApiError("MISSING_FINGERPRINT", "Brak identyfikatora użytkownika", 400);
        }

        // 1️⃣ Pobierz istniejące ratings dla przepisu

        const recipe = await writeClient.fetch<{ _id: string; ratings?: RecipeRating[] }>('*[_type == "recipe" && _id == $id][0]{ _id, ratings }', { id: recipeId });

        if (!recipe?._id) {
            throw new ApiError("RECIPE_NOT_FOUND", "Nie znaleziono przepisu", 404);
            // return NextResponse.json({ error: "Nie znaleziono przepisu" }, { status: 404 });
        }

        const existingRatings = recipe.ratings || [];
        const existingRating = existingRatings.find(r => r.fingerprint === fingerprint);

        // 2️⃣ Obsługa przypadku nowa ocena = stara ocena
        if (existingRating && existingRating.rating === rating) {
            return NextResponse.json({
                ok: true,
                data: {
                    status: "noChange",
                    existingRating,
                },
            });
        }

        // 3️⃣ Obsługa konfliktu: różna ocena, brak overwrite
        if (existingRating && !overwrite) {
            return NextResponse.json(
                {
                    ok: true,
                    data: {
                        status: "exists",
                        existingRating,
                    },
                },
                { status: 409 }
            );
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

        return NextResponse.json({
            ok: true,
            data: {
                status: "updated",
                ratingSummary,
                ratingSent: rating,
            },
        });
    } catch (err: unknown) {
        console.error("Error saving rating:", err);
        return apiErrorResponse(err);
    }
}

export async function GET(req: NextRequest) {
    try {
        const recipeId = req.nextUrl.searchParams.get("recipeId");

        if (!recipeId) {
            throw new ApiError("RECIPE_NOT_FOUND", "Nie znaleziono przepisu", 404);
        }

        const recipe = await client.fetch<{
            ratingSummary?: RatingSummary;
        }>(
            `*[_type == "recipe" && _id == $id][0]{
                ratingSummary
            }`,
            { id: recipeId }
        );

        return NextResponse.json({
            ok: true,
            data: {
                average: recipe?.ratingSummary?.average ?? null,
                count: recipe?.ratingSummary?.count ?? 0,
            },
        });
    } catch (err: unknown) {
        console.error("Error fetching ratings:", err);
        return apiErrorResponse(err);
    }
}

// TODO: recipe-ratings validation — rating value check

// W endpointzie /api/recipe-ratings obecnie używamy prostego sprawdzenia if (!rating). Jest to akceptowalne tylko dlatego, że aktualny model ocen zakłada wartości wyłącznie od 1 do 5, więc 0 nie jest poprawną oceną.

// Jeżeli w przyszłości zmieni się domena ocen (np. zostanie dopuszczone 0) albo walidacja będzie zaostrzana, należy zastąpić ten warunek bardziej precyzyjnym sprawdzeniem:

// rozróżnienie braku wartości (undefined / null)
// od niepoprawnej wartości (poza zakresem, zły typ).

// Przy okazji sprawdzić, czy kody błędów powinny rozróżniać MISSING_RATING i INVALID_RATING.

//todo czy wszędzie musi być writeclient???
