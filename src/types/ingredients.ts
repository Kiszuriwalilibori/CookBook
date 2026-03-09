// types/ingredients.ts

// import type { Recipe } from "@/types/recipe";

// export type RecipeIngredientsInput = Pick<Recipe, "title" | "ingredients">;

// export interface RecipeIngredientsInput {
//     title: string;
//     ingredients: NonNullable<Recipe["ingredients"]>;
// }
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
