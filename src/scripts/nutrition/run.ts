import { nutritionData } from "./nutritionData";
import { patchRecipeNutrition } from "./patchRecipeNutrition";

async function main() {
    await patchRecipeNutrition(nutritionData);
}

main().catch(console.error);
// upewnij się że z pliku nutritionData jest eksportowana nutritionData a nie exampleRecipe
