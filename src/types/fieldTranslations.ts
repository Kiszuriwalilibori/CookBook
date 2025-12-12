import { Recipe } from "./recipe";
type SourceKeys = `source.${keyof NonNullable<Recipe["source"]>}`;
type AllowedRecipeFields = keyof Recipe | SourceKeys;


export const fieldTranslations: Partial<Record<AllowedRecipeFields, string>> = {
    title: "Nazwa",
    calories: "Kalorie",
    cookTime: "Czas aktywnej pracy",
    dietary: "Rodzaj diety",
    tags: "Etykiety",
    cuisine: "Kuchnia",
    prepTime: "Całkowity czas przygotowania",
    recipeYield: "Porcje",
    notes: "Notatki",
    products: "Produkt",
    status: "Status",
    "source.url": "Link",
    "source.book": "Tytuł książki",
    "source.title": "Tytuł książki",
    "source.author": "Autor książki",
    "source.where": "Katalog",
};
