import { Recipe } from "@/lib/types";
import { ReactNode } from "react";

export interface MenuItem {
    label: string;
    href: string;
    icon?: ReactNode; // For MUI icons
}

type DotPrefix<T extends string> = `source.${T}`;

type StringKeys<T> = {
    [K in keyof T]-?: T[K] extends string | undefined ? K : never; // Accept optional strings
}[keyof T];

export type SourceKeys = DotPrefix<StringKeys<NonNullable<Recipe["source"]>>>;

export type BaseFilterableKeys = keyof Pick<Recipe, "title" | "products" | "tags" | "dietary" | "cuisine" | "Kizia" | "status">;

export type FilterableRecipeKeys = BaseFilterableKeys | SourceKeys;
// export type RecipeFilter = Record<FilterableRecipeKeys, string[]>;
export type RecipeFilter = Record<Exclude<FilterableRecipeKeys, "Kizia" | "status">, string[]>;
// todo RecipeFilter => RecipeFilterOptions?

export const EMPTY_RECIPE_FILTER: RecipeFilter = {
    title: [],
    cuisine: [],
    tags: [],
    dietary: [],
    products: [],

    "source.title": [],
    "source.http": [],
    "source.book": [],
    "source.author": [],
    "source.where": [],
};

export type Status = "Good" | "Acceptable" | "Improvement" | "Forget";

export const StatusOptions: { title: string; value: Status }[] = [
    { title: "Good", value: "Good" },
    { title: "Acceptable", value: "Acceptable" },
    { title: "Improvement", value: "Improvement" },
    { title: "Forget", value: "Forget" },
];
