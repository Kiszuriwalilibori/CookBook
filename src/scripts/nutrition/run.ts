import { exampleRecipe } from "./exampleRecipe";
import { patchRecipeNutrition } from "./patchRecipeNutrition";

async function main() {
    await patchRecipeNutrition(exampleRecipe);
}

main().catch(console.error);
