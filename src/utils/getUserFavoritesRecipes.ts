import { writeClient } from "@/utils";
import type { Recipe } from "@/types";
import { recipeCardProjection } from "@/utils/projections/recipeCardProjection";

export async function getUserFavoritesRecipes(userId: string): Promise<Recipe[]> {
    console.log("getUserFavorites", userId);
    if (!userId) return [];
    console.log("getUserFavorites userid", userId);
    const favorites = await writeClient.fetch(
        `*[_type=="favorite" && userId==$userId]{
            recipe->{
                ${recipeCardProjection}
            }
        } | order(createdAt desc)`,
        { userId }
    );

    return favorites.map((f: { recipe?: Recipe }) => f.recipe).filter(Boolean);
}
