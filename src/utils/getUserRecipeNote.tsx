import writeClient from "./writeClient";

export async function getUserRecipeNote(userEmail: string, recipeId: string): Promise<string | undefined> {
    const result = await writeClient.fetch(
        `*[_type == "recipeNotes" && userEmail == $userEmail && recipe._ref == $recipeId][0]{
      notes
    }`,
        { userEmail, recipeId }
    );

    return result?.notes;
}
