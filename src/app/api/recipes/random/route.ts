import { NextResponse } from "next/server";
import getRandomRecipes from "@/utils/getRandomRecipes";
import { apiErrorResponse } from "@/models/apiResponse";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const countParam = url.searchParams.get("count");
        const parsedCount = countParam ? parseInt(countParam, 10) : 5;

        const count = Number.isNaN(parsedCount) ? 5 : Math.max(1, Math.min(20, parsedCount));
        const recipes = await getRandomRecipes(count);

        return NextResponse.json(recipes);
    } catch (err) {
        console.error("[/api/recipes/random] error:", err);
        return apiErrorResponse(err);
    }
}
