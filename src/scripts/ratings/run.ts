// import { patchRecipeRatings } from "./patchRecipeRating";
// import { ratings } from "./ratings";

// async function main() {
//     await patchRecipeRatings(ratings);
// }

// main().catch(console.error);

import { addFakeRatings } from "./generateAndPatchRatings";

async function main() {
    console.log("🚀 Rozpoczynam generowanie fałszywych ocen...\n");

    await addFakeRatings("Falafele z dyni");
    await addFakeRatings("Czerwona kapusta stir-fry smażona z ryżem i pieczarkami");

    console.log("\n✅ Proces zakończony pomyślnie.");
}

main().catch(console.error);
