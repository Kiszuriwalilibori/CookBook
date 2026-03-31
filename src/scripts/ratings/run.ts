import { patchRecipeRatings } from "./patchRecipeRating";
import { exampleRecipeRatings } from "./RecipeRatingInput";

async function main() {
    await patchRecipeRatings(exampleRecipeRatings);
}

main().catch(console.error);
