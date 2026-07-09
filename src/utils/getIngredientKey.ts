import { RecipeIngredient } from "@/types";

export function getIngredientKey(recipeId: string, ingredient: RecipeIngredient): string {
    return `${recipeId}-${ingredient.name}-${ingredient.quantity}-${ingredient.unit ?? ""}`;
}
export default getIngredientKey;
