import { Recipe } from "@/types";
import React from "react";

type RecipeValue<K extends keyof Recipe> = Recipe[K];

export interface RecipeMetadataConfigItem<K extends keyof Recipe> {
    key: K;
    icon?: React.ReactNode;
    label?: string;
    format?: (value: NonNullable<RecipeValue<K>>, recipe: Recipe) => React.ReactNode;
}



// RecipeMetadata.types.ts
export interface RecipeMetadataFlat {
    prepTime?: number;
    cookTime?: number;
    recipeYield?: number;
    cuisine?: string[];
    calories?: number;
    dietary?: string[];
    tags?: string[];
    totalWeight?: number;
}
