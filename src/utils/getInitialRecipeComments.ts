import type { RecipeComment } from "@/types";
import { writeClient } from "@/utils/writeClient";

const INITIAL_THREADS_COUNT = 3;

export interface InitialRecipeComments {
    comments: RecipeComment[];
    totalComments: number;
    totalThreads: number;
}

export async function getInitialRecipeComments(recipeId: string): Promise<InitialRecipeComments> {
    const [rootComments, totalComments, totalThreads] = await Promise.all([
        writeClient.fetch<RecipeComment[]>(
            `*[
                _type == "recipeComment" &&
                recipeId == $recipeId &&
                (!defined(parentId) || parentId == null)
            ] | order(createdAt desc)[0...${INITIAL_THREADS_COUNT}]`,
            { recipeId }
        ),
        writeClient.fetch<number>(`count(*[_type == "recipeComment" && recipeId == $recipeId])`, { recipeId }),
        writeClient.fetch<number>(
            `count(*[
                _type == "recipeComment" &&
                recipeId == $recipeId &&
                (!defined(parentId) || parentId == null)
            ])`,
            { recipeId }
        ),
    ]);

    const comments = [...rootComments];
    let parentIds = rootComments.map(comment => comment._id);

    // Pobieramy kolejne poziomy odpowiedzi, aż nie będzie już potomków.
    while (parentIds.length > 0) {
        const replies = await writeClient.fetch<RecipeComment[]>(
            `*[
                _type == "recipeComment" &&
                recipeId == $recipeId &&
                parentId in $parentIds
            ] | order(createdAt asc)`,
            { recipeId, parentIds }
        );

        if (replies.length === 0) break;

        comments.push(...replies);
        parentIds = replies.map(comment => comment._id);
    }

    return {
        comments,
        totalComments,
        totalThreads,
    };
}
