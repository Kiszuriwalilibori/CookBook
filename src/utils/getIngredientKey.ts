import { RecipeIngredient } from "@/types";

export function getIngredientKey(recipeId: string, ingredient: RecipeIngredient): string {
    return `${recipeId}-${ingredient._key}`;
}

export default getIngredientKey;
