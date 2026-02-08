import { RecipeNutritionInput } from "@/types/nutrition";

export const exampleRecipe: RecipeNutritionInput = {
    title: "Surówka z kiszonej kapusty",
    totalWeight: 520,
    per100g: {
        calories: 79,
        protein: 0.83,
        fat: 5.8,
        carbohydrate: 6.8,
    },
    micronutrients: {
        vitaminA: 90,
        vitaminC: 13,
        vitaminD: 0,
        vitaminE: 0,
        vitaminK: 13.2,
        vitaminB6: 0.126,
        folate: 12,
        calcium: 24,
        iron: 0.42,
        magnesium: 15,
        potassium: 208,
        sodium: 237,
        zinc: 0.2,
        selenium: 0,
    },
};
