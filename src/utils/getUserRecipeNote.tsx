import writeClient from "./writeClient";

export async function getUserRecipeNote(userId: string, recipeId: string): Promise<string | undefined> {
    const result = await writeClient.fetch(
        `*[_type == "recipeNotes" && userId == $userId && recipe._ref == $recipeId][0]{
      notes
    }`,
        { userId, recipeId }
    );

    return result?.notes;
}
