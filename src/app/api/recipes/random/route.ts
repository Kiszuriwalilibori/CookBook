import { NextResponse } from "next/server";
import getRandomRecipes from "@/utils/getRandomRecipes";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const countParam = url.searchParams.get("count");
        const count = countParam ? Math.max(1, Math.min(20, parseInt(countParam, 10) || 5)) : 5;

        const recipes = await getRandomRecipes(count);

        // Zwracamy prostą tablicę MinimalRecipe (bez dodatkowego opakowania)
        return NextResponse.json(recipes, { status: 200 });
    } catch (err) {
        console.error("[/api/recipes/random] error:", err);
        return NextResponse.json({ error: "server_error" }, { status: 500 });
    }
}
