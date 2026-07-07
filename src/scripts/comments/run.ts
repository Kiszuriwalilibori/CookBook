// runImportComments.ts

import { comments } from "./comments";
import { importRecipeComments } from "./importRecipeComments";

async function main() {
    await importRecipeComments({
        recipeTitle: "Adżapsandali",
        comments,
        overwrite: true,
    });
}

main().catch(console.error);
