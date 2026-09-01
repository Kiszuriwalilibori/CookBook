import { ApiResponse } from "@/models/apiResponse";

export const saveRecipeNote = async (recipeId: string, notes: string) => {
    const response = await fetch("/api/recipe-notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            recipeId,
            notes,
        }),
    });

    const result: ApiResponse<null> = await response.json();

    if (!result.ok) {
        throw result.error;
    }

    return result.data;
};

export const deleteRecipeNote = async (recipeId: string) => {
    const response = await fetch(`/api/recipe-notes?recipeId=${recipeId}`, {
        method: "DELETE",
    });

    const result: ApiResponse<null> = await response.json();

    if (!result.ok) {
        throw result.error;
    }

    return result.data;
};
