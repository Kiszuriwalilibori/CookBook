import { getTranslation } from "@/models/fieldTranslations";

import { RecipeMetadataConfigItem } from "./RecipeMetadata.types";
import { Recipe } from "@/types";
import { formatArray, formatMinutes, formatYield } from "./RecipeMetadata.utils";
export function defineRecipeMetadata<K extends keyof Recipe>(item: RecipeMetadataConfigItem<K>): RecipeMetadataConfigItem<K> {
    return item;
}

export const recipeMetadataConfig = [
    defineRecipeMetadata({
        key: "prepTime", // ✔️ istnieje w Recipe
        icon: "⏱️",
        label: getTranslation("prepTime"),
        format: value => formatMinutes(value), // value: number
    }),
    defineRecipeMetadata({
        key: "cookTime",
        icon: "⏲️",
        label: getTranslation("cookTime"),
        format: value => formatMinutes(value),
    }),
    defineRecipeMetadata({
        key: "recipeYield",
        icon: "🍽️",
        format: value => formatYield(value),
    }),
    defineRecipeMetadata({
        key: "cuisine",
        icon: "🌍",
        format: value => formatArray(value), // string[]
    }),
    defineRecipeMetadata({
        key: "calories",
        icon: "🔥",
        label: getTranslation("calories"),
        format: value => value, // number
    }),
    defineRecipeMetadata({
        key: "dietary",
        icon: "🚫",
        label: getTranslation("dietary"),
        format: value => formatArray(value),
    }),
    defineRecipeMetadata({
        key: "tags",
        icon: "🏷️",
        label: getTranslation("tags"),
        format: value => formatArray(value),
    }),
    defineRecipeMetadata({
        key: "calories",
        icon: "⚡",
        label: getTranslation("calories"),
        format: value => value, // number
    }),
    // defineRecipeMetadata({
    //     key: "totalWeight",
    //     icon: "⚖️",
    //     label: getTranslation("totalWeight"),
    //     format: value => value, // number
    // }),
] as const;
