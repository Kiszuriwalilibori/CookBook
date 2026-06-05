// runImportComments.ts

import { comments } from "./comments";
import { importRecipeComments } from "./importRecipeComments";

async function main() {
    await importRecipeComments({
        recipeTitle: "Makaron z truskawkami",
        comments,
    });
}

main().catch(console.error);
