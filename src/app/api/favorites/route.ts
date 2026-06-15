// src/app/api/favorites/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUserFavorites, writeClient, client } from "@/utils";
import { getUserIdFromCookies } from "@/utils/server/getUserIdFromCookies";
import { ApiError } from "../comments/comment.service";
// POST → dodanie ulubionego
export async function POST(req: NextRequest) {
    try {
        const { recipeId } = await req.json();
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

        const user = await getUserIdFromCookies();

        if (!user) {
            // console.warn("[favorites][POST] No token, user not logged in");
            throw new ApiError("MISSING_USER", "Nie zdefiniowano użytkownika", 401);
            // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Sprawdzenie, czy ulubiony już istnieje
        // const existing = await client.fetch(`*[_type=="favorite" && userId==$userId && recipe._ref==$recipeId][0]`, { userId: user, recipeId });
        const existing = await client.fetch(`defined(*[_type=="favorite" && userId==$userId && recipe._ref==$recipeId][0]._id)`, {
            userId: user,
            recipeId,
        });

        if (existing) {
            throw new ApiError("ALREADY_FAVORITE", "Ten przepis już należy do ulubionych", 409);
        }

        await writeClient.create({
            _type: "favorite",
            userId: user,
            recipe: { _type: "reference", _ref: recipeId },
        });

        return NextResponse.json(
            {
                ok: true,
                data: {
                    title: recipe.title,
                },
            },
            { status: 200 }
        );
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: err.code,
                        message: err.message,
                    },
                },
                { status: err.status ?? 500 }
            );
        } else {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Wystąpił nieoczekiwany błąd serwera",
                    },
                },
                { status: 500 }
            );
        }
    }
    // console.error("[favorites][POST] Error:", err);
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// DELETE → usunięcie ulubionego
export async function DELETE(req: NextRequest) {
    try {
        const { recipeId } = await req.json();
        if (!recipeId) {
            return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
        }

        // używamy helpera

        const user = await getUserIdFromCookies();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ids = await writeClient.fetch(`*[_type=="favorite" && userId==$userId && recipe._ref==$recipeId]._id`, { userId: user, recipeId });
        await Promise.all(ids.map((id: string) => writeClient.delete(id)));

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[favorites][DELETE] Error:", err);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await getUserIdFromCookies();
        if (!user) {
            return NextResponse.json([], { status: 401 });
        }

        // pobranie ulubionych
        const favorites = await getUserFavorites(user);

        return NextResponse.json(favorites);
    } catch (err) {
        console.error("[favorites][GET] Error:", err);
        return NextResponse.json([], { status: 401 });
    }
}
