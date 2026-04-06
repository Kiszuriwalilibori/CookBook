import { RecipeNutritionInput } from "@/types/nutrition";

export const nutritionData: RecipeNutritionInput = {
    title: "Dorsz pieczony",
    totalWeight: 425,
    per100g: {
        calories: 142.6,
        protein: 16.9,
        fat: 7.2,
        carbohydrate: 1.9,
    },
    micronutrients: {
        vitaminA: 50.0,
        vitaminC: 20.0,
        vitaminD: 0.9,
        vitaminE: 5.0,
        vitaminK: 10.0,
        vitaminB6: 0.2,
        folate: 40.0,
        calcium: 50.0,
        iron: 1.2,
        magnesium: 60.0,
        potassium: 900.0,
        sodium: 282.0,
        zinc: 0.8,
        selenium: 37.6,
    },
};
