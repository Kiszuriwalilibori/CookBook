import { RecipeNutritionInput } from "@/types/nutrition";

export const nutritionData: RecipeNutritionInput = {
    title: "Chilli con carne",
    totalWeight: 2250,
    per100g: {
        calories: 112.3,
        protein: 7.8,
        fat: 5.6,
        carbohydrate: 8.9,
    },
    micronutrients: {
        vitaminA: 210.4,
        vitaminC: 12.8,
        vitaminD: 0.1,
        vitaminE: 0.9,
        vitaminK: 6.5,
        vitaminB6: 0.3,
        folate: 42.7,
        calcium: 48.3,
        iron: 2.1,
        magnesium: 32.6,
        potassium: 356.2,
        sodium: 420.5,
        zinc: 1.6,
        selenium: 9.8,
    },
};
