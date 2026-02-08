export interface Per100g {
    calories: number;
    protein: number;
    fat: number;
    carbohydrate: number;
}

export interface Micronutrients {
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    thiamin?: number;
    riboflavin?: number;
    niacin?: number;
    vitaminB6?: number;
    folate?: number;
    vitaminB12?: number;
    calcium?: number;
    iron?: number;
    magnesium?: number;
    potassium?: number; // mg
    sodium?: number; // mg
    zinc?: number;
    selenium?: number;
}

export interface RecipeNutritionInput {
    title: string;
    totalWeight: number;
    per100g: Per100g;
    micronutrients: Micronutrients;
}
