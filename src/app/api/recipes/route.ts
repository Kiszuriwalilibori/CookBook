// app/api/recipes/route.ts
import { NextResponse } from "next/server";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { type FilterState } from "@/models/filters";

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
