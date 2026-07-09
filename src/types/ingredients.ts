import type { Recipe } from "@/types/recipe";

type RecipeIngredientItem = NonNullable<Recipe["ingredients"]>[number];

export interface RecipeIngredientsInput {
    title: string;
    ingredients: Array<
        Omit<RecipeIngredientItem, "quantity"> & {
            quantity?: number;
        }
    >;
}
