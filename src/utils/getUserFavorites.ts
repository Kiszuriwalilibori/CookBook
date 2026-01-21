import { writeClient } from "@/utils";
import type { Recipe } from "@/types";
export async function getUserFavorites(userId: string): Promise<Recipe[]> {
    if (!userId) return [];

    const favorites = await writeClient.fetch(
        `*[_type=="favorite" && userId==$userId]{
            recipe->{
                _id,
                title,
                slug,
                prepTime,
                cookTime,
                recipeYield,
                tags,
                dietary,
                products,
                kizia,
                status,
                description {
                    title,
                    firstBlockText,
                    image {
                        asset->{
                            url
                        }
                    }
                }
            }
        } | order(createdAt desc)`,
        { userId }
    );

    return favorites.map((f: { recipe?: Recipe }) => f.recipe).filter(Boolean);
}
