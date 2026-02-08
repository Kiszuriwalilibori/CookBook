
import type { RecipeNutritionInput } from "../../types/nutrition";
import { createClient } from "@sanity/client";

export const writeClient = createClient({
    projectId: "mextu0pu", // <--- hardkodowane
    dataset: "production",
    apiVersion: "2024-10-14",
    token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV", // <--- hardkodowane
    useCdn: false, // zawsze false w skryptach
});

const client = writeClient;

export async function patchNutritionByTitle(recipe: RecipeNutritionInput): Promise<void> {
    const { title, per100g, totalWeight, micronutrients } = recipe;

    const query = `
    *[_type == "recipe" && title == $title][0]{ _id }
  `;

    const doc: { _id?: string } = await client.fetch(query, { title });

    if (!doc?._id) {
        throw new Error(`❌ Nie znaleziono przepisu: "${title}"`);
    }

    await client
        .patch(doc._id)
        .set({
            nutrition: {
                per100g,
                totalWeight,
                micronutrients,
                calculatedAt: new Date().toISOString(),
                rawData: JSON.stringify(recipe),
            },
        })
        .commit();

    console.log(`✅ Zaktualizowano nutrition: ${title}`);
}
