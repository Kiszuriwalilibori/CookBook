import { NestedRecipeKeys } from "../types/recipe";

type AllowedRecipeFields = NestedRecipeKeys;
export const fieldTranslations: Record<string, string> = {
    title: "Nazwa",
    calories: "Kalorie (kcal/100g)",
    cookTime: "Czas aktywnej pracy",
    prepTime: "Całkowity czas przygotowania",
    recipeYield: "Porcje",
    dietary: "Rodzaj diety",
    cuisine: "Kuchnia",
    tags: "Etykiety",
    notes: "Notatki",
    status: "Status",
    products: "Produkty",
    "nutrition.totalWeight": "Łączna waga potrawy (g)",
    "source.url": "Link",
    "source.book": "Tytuł książki",
    "source.title": "Tytuł książki",
    "source.author": "Autor książki",
    "source.where": "Katalog",
} as const satisfies { [K in AllowedRecipeFields]?: string };

export const getTranslation = (field: string): string => fieldTranslations[field] || field;
