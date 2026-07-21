import { NextResponse } from "next/server";
import getRandomRecipes from "@/utils/getRandomRecipes";
import { ApiResponse, apiErrorResponse } from "@/models/apiResponse";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const countParam = url.searchParams.get("count");
        const count = countParam ? Math.max(1, Math.min(20, parseInt(countParam, 10) || 5)) : 5;

        const recipes = await getRandomRecipes(count);

        const response: ApiResponse<typeof recipes> = {
            ok: true,
            data: recipes,
        };
        return NextResponse.json(response);
    } catch (err) {
        console.error("[/api/recipes/random] error:", err);
        return apiErrorResponse(err);
    }
}
