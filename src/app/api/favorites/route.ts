// src/app/api/favorites/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUserFavorites, getUserFromCookies, writeClient } from "@/utils";
// POST → dodanie ulubionego
export async function POST(req: NextRequest) {
    try {
        const { recipeId } = await req.json();
        console.log("[favorites][POST] Received recipeId:", recipeId);

        if (!recipeId) {
            console.warn("[favorites][POST] Missing recipeId");
            return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
        }

        // Pobranie usera za pomocą helpera
        const user = await getUserFromCookies();

        if (!user) {
            console.warn("[favorites][POST] No token, user not logged in");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("[favorites][POST] Verified user:", user);

        // Sprawdzenie, czy ulubiony już istnieje
        const existing = await writeClient.fetch(`*[_type=="favorite" && userId==$userId && recipe._ref==$recipeId][0]`, { userId: user.userId, recipeId });

        console.log("[favorites][POST] Existing favorite:", existing);

        if (!existing) {
            await writeClient.create({
                _type: "favorite",
                userId: user.userId,
                recipe: { _type: "reference", _ref: recipeId },
                createdAt: new Date().toISOString(),
            });
            console.log("[favorites][POST] Favorite created!");
        } else {
            console.log("[favorites][POST] Favorite already exists, skipping create.");
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[favorites][POST] Error:", err);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

// DELETE → usunięcie ulubionego
export async function DELETE(req: NextRequest) {
    try {
        const { recipeId } = await req.json();
        if (!recipeId) {
            return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
        }

        // używamy helpera
        const user = await getUserFromCookies();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ids = await writeClient.fetch(`*[_type=="favorite" && userId==$userId && recipe._ref==$recipeId]._id`, { userId: user.userId, recipeId });

        await Promise.all(ids.map((id: string) => writeClient.delete(id)));

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[favorites][DELETE] Error:", err);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}


export async function GET(req: NextRequest) {
    try {
        // używamy helpera, który sam obsłuży cookie + verifyGoogle
        const user = await getUserFromCookies();

        if (!user) {
            return NextResponse.json([], { status: 401 });
        }

        // pobranie ulubionych
        const favorites = await getUserFavorites(user.userId);

        return NextResponse.json(favorites);
    } catch (err) {
        console.error("[favorites][GET] Error:", err);
        return NextResponse.json([], { status: 401 });
    }
}


