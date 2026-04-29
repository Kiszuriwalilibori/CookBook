import { addFakeRatings } from "./generateAndPatchRatings";

async function main() {
    console.log("🚀 Rozpoczynam generowanie fałszywych ocen...\n");

    await addFakeRatings("Burrito");
    await addFakeRatings("Chilli con carne");
    // await addFakeRatings("Czerwona kapusta stir-fry smażona z ryżem i pieczarkami");

    console.log("\n✅ Proces zakończony pomyślnie.");
}

main().catch(console.error);
