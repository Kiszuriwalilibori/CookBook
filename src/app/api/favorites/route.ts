// src/app/api/favorites/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUserFavorites, writeClient, client } from "@/utils";
import { getUserIdFromCookies } from "@/utils/server/getUserIdFromCookies";
import { ApiError } from "../comments/comment.service";
import { apiErrorResponse } from "@/utils/server/apiErrorResponse";

async function parseBody(req: NextRequest): Promise<{ recipeId?: string }> {
    try {
        return await req.json();
    } catch {
        throw new ApiError("INVALID_JSON", "Nieprawidłowy format JSON", 400);
    }
}
// POST → dodanie ulubionego
export async function POST(req: NextRequest) {
    try {
        const user = await getUserIdFromCookies();

        if (!user) {
            throw new ApiError("MISSING_USER", "Nie zdefiniowano użytkownika", 401);
        }

        const { recipeId } = await parseBody(req);

        if (!recipeId) {
            throw new ApiError("MISSING_RECIPE_ID", "Brak Id przepisu", 400);
        }

        const recipe = await client.fetch(
            `*[_type == "recipe" && _id == $recipeId][0]{
        _id,
        title
    }`,
            { recipeId }
        );

        if (!recipe) {
            throw new ApiError("RECIPE_NOT_FOUND", "Nie znaleziono przepisu", 404);
        }

        // Sprawdzenie, czy ulubiony już istnieje

        const isExisting = await client.fetch(`defined(*[_type=="favorite" && userId==$userId && recipe._ref==$recipeId][0]._id)`, {
            userId: user,
            recipeId,
        });

        if (isExisting) {
            throw new ApiError("ALREADY_FAVORITE", "Ten przepis już należy do ulubionych", 409);
        }

        await writeClient.create({
            _type: "favorite",
            userId: user,
            recipe: { _type: "reference", _ref: recipeId },
        });

        const result = {
            ok: true,
            data: {
                title: recipe.title,
            },
        };

        return NextResponse.json(result, { status: 200 });
    } catch (err: unknown) {
        return apiErrorResponse(err);
    }
}
// DELETE → usunięcie ulubionego
export async function DELETE(req: NextRequest) {
    try {
        const { recipeId } = await parseBody(req);

        if (!recipeId) {
            throw new ApiError("MISSING_RECIPE_ID", "Brak Id przepisu", 400);
        }

        const user = await getUserIdFromCookies();

        if (!user) {
            throw new ApiError("MISSING_USER", "Nie zdefiniowano użytkownika", 401);
        }

        const favorites = await client.fetch<
            {
                _id: string;
                title: string;
            }[]
        >(
            `*[_type == "favorite" && userId == $userId && recipe._ref == $recipeId]{
                _id,
                "title": recipe->title
            }`,
            {
                userId: user,
                recipeId,
            }
        );

        if (favorites.length === 0) {
            throw new ApiError("FAVORITE_NOT_FOUND", "Przepis nie znajduje się w ulubionych", 404);
        }

        for (const favorite of favorites) {
            await writeClient.delete(favorite._id);
        }

        return NextResponse.json({
            ok: true,
            data: {
                title: favorites[0].title,
            },
        });
    } catch (err: unknown) {
        return apiErrorResponse(err);
    }
}
// GET → pobranie ulubionego
export async function GET() {
    try {
        const user = await getUserIdFromCookies();

        if (!user) {
            throw new ApiError("MISSING_USER", "Nie zdefiniowano użytkownika", 401);
        }

        const favorites = await getUserFavorites(user);

        return NextResponse.json({
            ok: true,
            data: favorites,
        });
    } catch (err: unknown) {
        return apiErrorResponse(err);
    }
}
