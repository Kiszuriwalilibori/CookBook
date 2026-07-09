// runImportComments.ts

import { comments } from "./comments";
import { importRecipeComments } from "./importRecipeComments";

async function main() {
    await importRecipeComments({
        recipeTitle: "Wiosenna sałatka z kozim serem i truskawkami",
        comments,
        overwrite: false,
    });
}

main().catch(console.error);
