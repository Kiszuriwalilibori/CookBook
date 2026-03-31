import { nutritionData } from "./nutritionData";
import { patchRecipeNutrition } from "./patchRecipeNutrition";

async function main() {
    await patchRecipeNutrition(nutritionData);
}

main().catch(console.error);
