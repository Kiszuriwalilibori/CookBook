// runPatchIngredients.ts

import {ingredients } from "./ingredients";
import { patchRecipeIngredients } from "./patchRecipeIngredients";

async function main() {
    await patchRecipeIngredients(ingredients);
}

main().catch(console.error);
