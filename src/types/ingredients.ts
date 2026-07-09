import type { RecipeIngredient } from "@/types/recipe";

export interface RecipeIngredientsInput {
    title: string;
    ingredients: Array<
        Omit<RecipeIngredient, "quantity"> & {
            quantity?: number;
        }
    >;
}
