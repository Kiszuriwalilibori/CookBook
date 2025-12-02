// app/api/recipes/route.ts
import { NextResponse } from "next/server";
import { getRecipesForCards } from "@/lib/getRecipesForCards";
import { type FilterState } from "@/types";

// Handles POST requests: client sends JSON { filters }
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const filters = body?.filters as Partial<FilterState>;

        const recipes = await getRecipesForCards(filters);
        return NextResponse.json(recipes, { status: 200 });
    } catch (err) {
        console.error("Error fetching filtered recipes:", err);
        return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
    }
}

// Optional: allow simple GET /api/recipes?cuisine=Italian&tag=Vegan
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const filters: Partial<FilterState> = {
        cuisine: searchParams.get("cuisine") || undefined,
        title: searchParams.get("title") || undefined,
        tags: searchParams.getAll("tags"),
        dietary: searchParams.getAll("dietary"),
        products: searchParams.getAll("products"),
    };
    //todo tu ewidentnie brakuje nowszych pól!!!
    try {
        const recipes = await getRecipesForCards(filters);
        return NextResponse.json(recipes, { status: 200 });
    } catch (err) {
        console.error("Error fetching recipes:", err);
        return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
    }
}
