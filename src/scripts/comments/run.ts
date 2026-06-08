// runImportComments.ts

import { comments } from "./comments";
import { importRecipeComments } from "./importRecipeComments";

async function main() {
    await importRecipeComments({
        recipeTitle: "Rumsztyk",
        comments,
    });
}

main().catch(console.error);
