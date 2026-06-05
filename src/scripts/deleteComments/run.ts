import { deleteAllRecipeComments } from "./deleteAllRecipeComments";

async function main() {
    await deleteAllRecipeComments();
}

main().catch(console.error);
