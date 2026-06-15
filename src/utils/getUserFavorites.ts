import { writeClient } from "@/utils";
import type { Recipe } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import { recipeCardProjection } from "@/utils/projections/recipeCardProjection";
export async function getUserFavorites(userId: string): Promise<Recipe[]> {
    noStore();
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

// export async function getUserFavorites(userId: string): Promise<string[]> {
//     if (!userId) return [];
//     const favorites = writeClient.fetch(`*[_type == "favorite" && userId == $userId].recipe._ref`, { userId });
//     return favorites;
// }
