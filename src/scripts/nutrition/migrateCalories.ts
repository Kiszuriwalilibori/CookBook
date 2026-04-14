import { createClient } from "@sanity/client";

const client = createClient({
    projectId: "mextu0pu",
    dataset: "production",
    apiVersion: "2024-10-14",
    token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV", // <--- hardkodowane
    useCdn: false,
});

async function migrateCalories() {
    try {
        const recipes: {
            _id: string;
            title?: string;
            calories: number;
        }[] = await client.fetch(`
      *[_type == "recipe" && defined(nutrition.per100g.calories)]{
        _id,
        title,
        "calories": nutrition.per100g.calories
      }
    `);

        console.log(`🔎 Znaleziono ${recipes.length} przepisów`);

        let updated = 0;
        let skipped = 0;

        for (const recipe of recipes) {
            if (typeof recipe.calories !== "number") {
                console.log(`⚠️ Pominięto (brak liczby): ${recipe.title ?? recipe._id}`);
                skipped++;
                continue;
            }

            const rounded = Math.round(recipe.calories);

            if (rounded === recipe.calories) {
                skipped++;
                continue;
            }

            await client
                .patch(recipe._id)
                .set({
                    "nutrition.per100g.calories": rounded,
                })
                .commit();

            console.log(`✔ ${recipe.title ?? recipe._id}: ${recipe.calories} → ${rounded}`);

            updated++;
        }

        console.log("\n✅ Migracja zakończona");
        console.log(`✔ Zaktualizowano: ${updated}`);
        console.log(`➖ Pominięto: ${skipped}`);
    } catch (err) {
        console.error("❌ Błąd migracji:", err);
    }
}

migrateCalories();
