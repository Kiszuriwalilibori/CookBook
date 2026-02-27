
import { Recipe } from "@/types";
import { RecipeMetadataFlat } from "./RecipeMetadata.types";

export const formatMinutes = (minutes: number) => `${minutes} min`;

export const formatYield = (yieldCount: number) => {
    if (yieldCount === 1) return `${yieldCount} porcja`;
    if (yieldCount >= 2 && yieldCount <= 4) return `${yieldCount} porcje`;
    return `${yieldCount} porcji`;
};

export const formatArray = (arr: string[]) => arr.join(", ");

// export function hasValue<T, K extends keyof T>(obj: T, key: K): boolean {
//     const value = obj[key];

//     if (value == null) return false;

//     if (Array.isArray(value)) return value.length > 0;

//     if (typeof value === "string") return value.trim().length > 0;

//     return Boolean(value); // number, boolean itp.
// }

export function hasValue<T extends object, K extends keyof T>(obj: T | undefined | null, key: K): boolean {
    if (!obj) return false;

    const value = obj[key];
    if (value == null) return false;

    if (Array.isArray(value)) return value.length > 0;

    return true;
}
export function mapRecipeToMetadata(recipe: Recipe): RecipeMetadataFlat {
    return {
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        recipeYield: recipe.recipeYield,
        cuisine: recipe.cuisine,
        dietary: recipe.dietary,
        tags: recipe.tags,
        calories: recipe.nutrition?.per100g?.calories,
        totalWeight: recipe.nutrition?.totalWeight,
    };
}
