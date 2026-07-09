// import { RecipeIngredient } from "@/types";

// export function getIngredientKey(recipeId: string, ingredient: RecipeIngredient): string {
//     return `${recipeId}-${ingredient.name}-${ingredient.quantity}-${ingredient.unit ?? ""}`;
// }
// export default getIngredientKey;

// // todo rozważyć wykorzytanie _key z sanity bo faktycznie jest, choć nie przewiduje go typ

import { RecipeIngredient } from "@/types";

export function getIngredientKey(recipeId: string, ingredient: RecipeIngredient): string {
    return `${recipeId}-${ingredient._key}`;
}

export default getIngredientKey;
