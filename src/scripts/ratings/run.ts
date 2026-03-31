import { patchRecipeRatings } from "./patchRecipeRating";
import { ratings } from "./ratings";

async function main() {
    await patchRecipeRatings(ratings);
}

main().catch(console.error);
