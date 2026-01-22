import { ReactNode } from "react";
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
export type FilterArrayKey = keyof RecipeFilter;
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
// const enum – typ bazowy
const enum StatusEnum {
    Good = "Good",
    Acceptable = "Acceptable",
    Improvement = "Improvement",
    Forget = "Forget",
}

// brandowany typ – nie w runtime, tylko do typowania
export type Status = `${StatusEnum}` & { readonly __brand: unique symbol };

// obiekt, którego używasz w kodzie (z dużej litery)
export const Status = {
    Good: StatusEnum.Good as Status,
    Acceptable: StatusEnum.Acceptable as Status,
    Improvement: StatusEnum.Improvement as Status,
    Forget: StatusEnum.Forget as Status,
};

export const StatusOptions = [
    { title: "Good", value: Status.Good },
    { title: "Acceptable", value: Status.Acceptable },
    { title: "Improvement", value: Status.Improvement },
    { title: "Forget", value: Status.Forget },
];

export const REGULAR_USER_STATUSES: readonly Status[] = [Status.Good, Status.Acceptable];

export type { Recipe };

export interface User {
    userId: string;
    email: string;
}
