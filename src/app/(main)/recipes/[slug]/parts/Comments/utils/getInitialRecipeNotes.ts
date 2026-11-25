import { ApiErrorPayload } from "@/models/apiResponse";
import { getUserRecipeNote } from "@/utils";

export interface InitialRecipeNotes {
    recipeNotes: string | undefined;
    recipeNotesLoadError: ApiErrorPayload | null;
}

export const INITIAL_RECIPE_NOTES: InitialRecipeNotes = {
    recipeNotes: undefined,
    recipeNotesLoadError: null,
};

export async function getInitialRecipeNotes(userId: string | null, recipeId: string): Promise<InitialRecipeNotes> {
    if (!userId) {
        return INITIAL_RECIPE_NOTES;
    }

    try {
        const recipeNotes = await getUserRecipeNote(userId, recipeId);

        return {
            ...INITIAL_RECIPE_NOTES,
            recipeNotes,
        };
    } catch (error) {
        console.error("Error loading private recipe notes:", error);

        return {
            ...INITIAL_RECIPE_NOTES,
            recipeNotesLoadError: {
                code: "USER_NOTES_FETCH_FAILED",
                message: "Nie udało się pobrać Twoich prywatnych notatek. Spróbuj ponownie później.",
            },
        };
    }
}
