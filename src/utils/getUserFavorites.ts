import { writeClient } from "@/utils";
import type { Recipe } from "@/types";
import { recipeCardProjection } from "@/utils/projections/recipeCardProjection";
export async function getUserFavorites(userId: string): Promise<Recipe[]> {
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
    console.log("getUserFavorites", userId, favorites.map((f: { recipe?: Recipe }) => f.recipe).filter(Boolean));
    return favorites.map((f: { recipe?: Recipe }) => f.recipe).filter(Boolean);
}

// export async function getUserFavorites(userId: string): Promise<string[]> {
//     if (!userId) return [];
//     const favorites = writeClient.fetch(`*[_type == "favorite" && userId == $userId].recipe._ref`, { userId });
//     return favorites;
// }
