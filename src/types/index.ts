import { Recipe } from "@/lib/types";
import { ReactNode } from "react";

export interface MenuItem {
    label: string;
    href: string;
    icon?: ReactNode; // For MUI icons
}

export type { FilterState, FilterValuesTypes } from "@/hooks/useFilters";

export type FilterableRecipeKeys = keyof Pick<Recipe, "title" | "products" | "tags" | "dietary" | "cuisine" | "Kizia">;

export type RecipeFilter = Record<FilterableRecipeKeys, string[]>;

// todo RecipeFilter => RecipeFilterOptions?
