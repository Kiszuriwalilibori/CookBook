import { Recipe } from "@/types";

type Ingredient = NonNullable<Recipe["ingredients"]>[number];

export function getIngredientKey(recipeId: string, ingredient: Ingredient): string {
    return `${recipeId}-${ingredient.name}-${ingredient.quantity}-${ingredient.unit ?? ""}`;
}
export default getIngredientKey;
