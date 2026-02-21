import { getTranslation } from "@/models/fieldTranslations";
import { RecipeMetadataConfigItem, RecipeMetadataFlat } from "./RecipeMetadata.types";
import { formatMinutes, formatYield } from "./RecipeMetadata.utils";
import { RecipeMetadataFilterChips } from "./RecipeMetadataFilterChips";

export function defineRecipeMetadata<K extends keyof RecipeMetadataFlat>(item: RecipeMetadataConfigItem<K>): RecipeMetadataConfigItem<K> {
    return item;
}

export const recipeMetadataConfig = [
    defineRecipeMetadata({
        key: "prepTime",
        icon: "⏱️",
        label: getTranslation("prepTime"),
        format: value => (value != null ? formatMinutes(value) : null),
    }),
    defineRecipeMetadata({
        key: "cookTime",
        icon: "⏲️",
        label: getTranslation("cookTime"),
        format: value => (value != null ? formatMinutes(value) : null),
    }),
    defineRecipeMetadata({
        key: "recipeYield",
        icon: "🍽️",
        format: value => (value != null ? formatYield(value) : null),
    }),
    
    defineRecipeMetadata({
        key: "cuisine",
        icon: "🌍",
        label: getTranslation("cuisine"),
        format: value => (value && value.length > 0 ? <RecipeMetadataFilterChips values={value} filterKey="cuisine" /> : null),
    }),
    defineRecipeMetadata({
        key: "calories",
        icon: "🔥",
        label: getTranslation("calories"),

        format: value => (value != null ? value : null),
    }),
    
    defineRecipeMetadata({
        key: "dietary",
        icon: "🚫",
        label: getTranslation("dietary"),
        format: value => (value && value.length > 0 ? <RecipeMetadataFilterChips values={value} filterKey="dietary" /> : null),
    }),
    
    defineRecipeMetadata({
        key: "tags",
        icon: "🏷️",
        label: getTranslation("tags"),
        format: value => (value && value.length > 0 ? <RecipeMetadataFilterChips values={value} filterKey="tags" /> : null),
    }),
    defineRecipeMetadata({
        key: "totalWeight",
        icon: "⚖️",
        label: getTranslation("totalWeight"),
        format: value => (value != null ? value : null),
    }),
] as const;
