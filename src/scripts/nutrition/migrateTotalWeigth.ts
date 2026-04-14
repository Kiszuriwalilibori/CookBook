import { createClient } from "@sanity/client";

const client = createClient({
    projectId: "mextu0pu",
    dataset: "production",
    apiVersion: "2024-10-14",
    token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV",
    useCdn: false,
});

function roundTotalWeight(weight?: number): number | undefined {
    if (typeof weight !== "number") return weight;

    if (weight < 1000) {
        return Math.round(weight / 10) * 10;
    }

    return Math.round(weight / 50) * 50;
}

async function migrateTotalWeight() {
    const recipes = await client.fetch(`
    *[_type == "recipe" && defined(nutrition.totalWeight)]{
      _id,
      title,
      "totalWeight": nutrition.totalWeight
    }
  `);

    console.log(`🔎 Znaleziono ${recipes.length} przepisów`);

    let updated = 0;
    let skipped = 0;

    for (const r of recipes) {
        if (typeof r.totalWeight !== "number") {
            skipped++;
            continue;
        }

        const rounded = roundTotalWeight(r.totalWeight);

        if (rounded === r.totalWeight) {
            skipped++;
            continue;
        }

        await client
            .patch(r._id)
            .set({
                "nutrition.totalWeight": rounded,
            })
            .commit();

        console.log(`✔ ${r.title ?? r._id}: ${r.totalWeight} → ${rounded}`);

        updated++;
    }

    console.log("\n✅ Migracja zakończona");
    console.log(`✔ Zaktualizowano: ${updated}`);
    console.log(`➖ Pominięto: ${skipped}`);
}

migrateTotalWeight();
