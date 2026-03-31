import { RecipeNutritionInput } from "@/types/nutrition";
export const exampleRecipe: RecipeNutritionInput = {
    title: "Kurczak w sezamie po chińsku",
    totalWeight: 637.3,
    per100g: {
        calories: 364.0,
        protein: 9.8,
        fat: 26.7,
        carbohydrate: 16.3,
    },
    micronutrients: {
        vitaminA: 45.0,
        vitaminC: 6.5,
        vitaminD: 0.4,
        vitaminE: 3.2,
        vitaminK: 18.0,
        vitaminB6: 0.4,
        folate: 28.0,
        calcium: 85.0,
        iron: 2.1,
        magnesium: 45.0,
        potassium: 220.0,
        sodium: 780.0,
        zinc: 1.6,
        selenium: 14.0,
    },
};