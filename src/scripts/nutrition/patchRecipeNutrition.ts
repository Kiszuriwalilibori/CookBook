// import type { RecipeNutritionInput } from "../../types/nutrition";
// import { createClient } from "@sanity/client";

// export const writeClient = createClient({
//     projectId: "mextu0pu", // <--- hardkodowane
//     dataset: "production",
//     apiVersion: "2024-10-14",
//     token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV", // <--- hardkodowane
//     useCdn: false, // zawsze false w skryptach
// });

// const client = writeClient;

// export async function patchRecipeNutrition(recipe: RecipeNutritionInput): Promise<void> {
//     const { title, per100g, totalWeight, micronutrients } = recipe;

//     const query = `
//     *[_type == "recipe" && title == $title][0]{ _id }
//   `;

//     const doc: { _id?: string } = await client.fetch(query, { title });

//     if (!doc?._id) {
//         throw new Error(`❌ Nie znaleziono przepisu: "${title}"`);
//     }
// const normalizedPer100g = {
//     ...per100g,
//     calories: per100g.calories ? Math.round(per100g.calories) : per100g.calories,
// };
//     await client
//         .patch(doc._id)
//         .set({
//             nutrition: {
//                 per100g: normalizedPer100g,
//                 totalWeight,
//                 micronutrients,
//                 calculatedAt: new Date().toISOString(),
//                 rawData: JSON.stringify(recipe),
//             },
//         })
//         .commit();

//     console.log(`✅ Zaktualizowano nutrition: ${title}`);
// }

import type { RecipeNutritionInput } from "../../types/nutrition";
import { createClient } from "@sanity/client";

export const writeClient = createClient({
    projectId: "mextu0pu",
    dataset: "production",
    apiVersion: "2024-10-14",
    token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV",
    useCdn: false,
});

const client = writeClient;

function roundTotalWeight(weight?: number): number | undefined {
    if (typeof weight !== "number") return weight;

    if (weight < 1000) {
        return Math.round(weight / 10) * 10;
    }

    return Math.round(weight / 50) * 50;
}

export async function patchRecipeNutrition(recipe: RecipeNutritionInput): Promise<void> {
    const { title, per100g, totalWeight, micronutrients } = recipe;

    const query = `
      *[_type == "recipe" && title == $title][0]{ _id }
    `;

    const doc: { _id?: string } = await client.fetch(query, { title });

    if (!doc?._id) {
        throw new Error(`❌ Nie znaleziono przepisu: "${title}"`);
    }

    const normalizedPer100g = {
        ...per100g,
        calories: typeof per100g.calories === "number" ? Math.round(per100g.calories) : per100g.calories,
    };

    const normalizedTotalWeight = roundTotalWeight(totalWeight);

    await client
        .patch(doc._id)
        .set({
            nutrition: {
                per100g: normalizedPer100g,
                totalWeight: normalizedTotalWeight,
                micronutrients,
                calculatedAt: new Date().toISOString(),
                rawData: JSON.stringify(recipe),
            },
        })
        .commit();

    console.log(`✅ ${title} | kcal: ${per100g.calories} → ${normalizedPer100g.calories}, weight: ${totalWeight} → ${normalizedTotalWeight}`);
}
