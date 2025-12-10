import { ReactNode } from "react";
import { fieldTranslations } from "./fieldTranslations";
import { Recipe } from "./recipe";

export interface MenuItem {
    label: string;
    href: string;
    icon?: ReactNode; // For MUI icons
}

// lib/types.ts (updated to match query's firstBlockText structure)

type DotPrefix<T extends string> = `source.${T}`;

type StringKeys<T> = {
    [K in keyof T]-?: T[K] extends string | undefined ? K : never; // Accept optional strings
}[keyof T];

export type SourceKeys = DotPrefix<StringKeys<NonNullable<Recipe["source"]>>>;

export type BaseFilterableKeys = keyof Pick<Recipe, "title" | "products" | "tags" | "dietary" | "cuisine" | "kizia" | "status">;

export type FilterableRecipeKeys = BaseFilterableKeys | SourceKeys;
// export type RecipeFilter = Record<FilterableRecipeKeys, string[]>;
export type RecipeFilter = Record<Exclude<FilterableRecipeKeys, "kizia" | "status">, string[]>;
// todo RecipeFilter => RecipeFilterOptions?

export const EMPTY_RECIPE_FILTER: RecipeFilter = {
    title: [],
    cuisine: [],
    tags: [],
    dietary: [],
    products: [],

    "source.title": [],
    "source.url": [],
    "source.book": [],
    "source.author": [],
    "source.where": [],
};

type Status = "Good" | "Acceptable" | "Improvement" | "Forget";

const StatusOptions: { title: string; value: Status }[] = [
    { title: "Good", value: "Good" },
    { title: "Acceptable", value: "Acceptable" },
    { title: "Improvement", value: "Improvement" },
    { title: "Forget", value: "Forget" },
];

// export interface Recipe {
//     _id: string;
//     title: string;
//     slug?: {
//         current: string;
//     };
//     description?: {
//         title?: string;
//         firstBlockText?: {
//             children?: Array<{
//                 text: string;
//             }>;
//         };
//         content?: PortableTextBlock[];
//         image?: {
//             asset?: {
//                 _id: string;
//                 url?: string;
//             };
//             alt?: string;
//         };
//         notes?: string;
//     };
//     ingredients?: Array<{
//         name: string;
//         quantity: number;
//         unit?: string;
//         excluded: boolean;
//     }>;
//     ingredientsNotes?: string;
//     products?: string[];
//     preparationSteps?: Array<{
//         _key?: string; //
//         content?: PortableTextBlock[];
//         image?: {
//             asset?: {
//                 _id: string;
//                 url?: string;
//             };
//             alt?: string;
//         };
//         notes?: string;
//     }>;
//     calories?: number;
//     prepTime?: number;
//     cookTime?: number;
//     recipeYield?: number;
//     cuisine?: string;
//     dietary?: string[];
//     tags?: string[];
//     notes?: string;
//     kizia?: boolean;
//     status: Status;
//     source?: {
//         url?: string;
//         book?: string;
//         title?: string;
//         author?: string;
//         where?: string;
//     };
// }

// export const fieldTranslations: Record<string, string> = {
//     title: "Nazwa",
//     calories: "Kalorie",
//     cookTime: "Czas aktywnej pracy",
//     dietary: "Rodzaj diety",
//     tags: "Etykiety",
//     cuisine: "Kuchnia",
//     prepTime: "Całkowity czas przygotowania",
//     recipeYield: "Porcje",
//     notes: "Notatki",
//     products: "Produkt",
//     status: "Status",
//     "source.url": "Link",
//     "source.book": "Tytuł książki",
//     "source.title": "Tytuł książki",
//     "source.author": "Autor książki",
//     "source.where": "Katalog",
// };

export { fieldTranslations, StatusOptions };
export type { Recipe, Status };
