import { Recipe } from "../types/recipe";

type SourceKeys = `source.${keyof NonNullable<Recipe["source"]>}`;
type NutritionKeys = `nutrition.${keyof NonNullable<Recipe["nutrition"]>}`;
type AllowedRecipeFields = keyof Recipe | SourceKeys | NutritionKeys;

export const fieldTranslations: Record<string, string> = {
    title: "Nazwa",
    calories: "Kalorie",
    cookTime: "Czas aktywnej pracy",
    prepTime: "Całkowity czas przygotowania",
    recipeYield: "Porcje",
    dietary: "Rodzaj diety",
    cuisine: "Kuchnia",
    tags: "Etykiety",
    notes: "Notatki",
    products: "Produkt",
    status: "Status",
    "nutrition.totalWeight": "Łączna waga",
    "source.url": "Link",
    "source.book": "Tytuł książki",
    "source.title": "Tytuł książki",
    "source.author": "Autor książki",
    "source.where": "Katalog",
} as const satisfies { [K in AllowedRecipeFields]?: string };

export const getTranslation = (field: string): string => fieldTranslations[field] || field;
