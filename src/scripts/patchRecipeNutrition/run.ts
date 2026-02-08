import { exampleRecipe } from "./exampleRecipe";
import { patchNutritionByTitle } from "./patchNutritionByTitle";

async function main() {
    await patchNutritionByTitle(exampleRecipe);
}

main().catch(console.error);
