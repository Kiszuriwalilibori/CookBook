// patchRecipeIngredients.ts

import type { RecipeIngredientsInput } from "@/types/ingredients";
import { createClient } from "@sanity/client";

export const writeClient = createClient({
    projectId: "mextu0pu",
    dataset: "production",
    apiVersion: "2024-10-14",
    token: "sk1nR4QlkQkoos5EeELATh3BSd5FiOnShQgS4UZxVpYzsKq8Brz99diSrvaxtXzF5hUhLrbQNyvclwPHAQ9kC1a0K2PGh7SclYOmgDGLYchbtVamslHckgPM2sthdRYe3ok3MGpgWQ0rZB7276ekDVc8Apl6odxR3teKhobZnPFa0XH1TrVV", // 🔐 NIE hardkoduj
    useCdn: false,
});

const client = writeClient;

export async function patchRecipeIngredients(recipe: RecipeIngredientsInput): Promise<void> {
    const { title, ingredients } = recipe;

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
            ingredients: ingredients.map(item => ({
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                excluded: item.excluded ?? false,
            })),
        })
        .commit();

    console.log(`✅ Zaktualizowano ingredients: ${title}`);
}

//todo z niewiadomych przyczyn trzeba hardkodować tokena bo się nie wczytuje
