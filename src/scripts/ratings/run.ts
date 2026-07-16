import { addFakeRatings } from "./generateAndPatchRatings";

async function main() {
    console.log("🚀 Rozpoczynam generowanie ocen...\n");

    await addFakeRatings("Fasolka szparagowa z masłem i parmezanem");
    // await addFakeRatings("Chilli con carne");
    // await addFakeRatings("Czerwona kapusta stir-fry smażona z ryżem i pieczarkami");

    console.log("\n✅ Proces zakończony pomyślnie.");
}

main().catch(console.error);
