import { RecipeNutritionInput } from "@/types/nutrition";
export const exampleRecipe: RecipeNutritionInput = {
    title: "Tortilla pszenna",
    totalWeight: 233.6,
    per100g: {
        calories: 339.6,
        protein: 6.4,
        fat: 12.6,
        carbohydrate: 48.8,
    },
    micronutrients: {
        vitaminA: 1.0,
        vitaminC: 0.0,
        vitaminD: 0.0,
        vitaminE: 1.6,
        vitaminK: 6.4,
        vitaminB6: 0.1,
        folate: 16.7,
        calcium: 31.0,
        iron: 2.3,
        magnesium: 14.1,
        potassium: 68.7,
        sodium: 342.5,
        zinc: 0.4,
        selenium: 21.2,
    },
};
