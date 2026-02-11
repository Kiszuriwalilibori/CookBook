
import React from "react";

export interface RecipeMetadataConfigItem<K extends keyof RecipeMetadataFlat> {
    key: K;
    icon: string;
    label?: string;
    format?: (value: RecipeMetadataFlat[K] | undefined, metadata: RecipeMetadataFlat) => React.ReactNode;
}

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
