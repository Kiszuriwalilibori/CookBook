import { getTranslation } from "@/models/fieldTranslations";
import { RecipeMetadataConfigItem, RecipeMetadataFlat } from "./RecipeMetadata.types";
import { formatMinutes, formatYield } from "./RecipeMetadata.utils";
import { RecipeMetadataFilterChips } from "./RecipeMetadataFilterChips";
import { recipeMetadataIcons } from "./RecipeMetadata.icons";

export function defineRecipeMetadata<K extends keyof RecipeMetadataFlat>(item: RecipeMetadataConfigItem<K>): RecipeMetadataConfigItem<K> {
    return item;
}

export const recipeMetadataConfig = [
    defineRecipeMetadata({
        key: "prepTime",
        icon: recipeMetadataIcons.prepTime,
        label: getTranslation("prepTime"),
        render: value => (value != null ? formatMinutes(value) : null),
    }),
    defineRecipeMetadata({
        key: "cookTime",
        icon: recipeMetadataIcons.cookTime,
        label: getTranslation("cookTime"),
        render: value => (value != null ? formatMinutes(value) : null),
    }),
    defineRecipeMetadata({
        key: "recipeYield",
        icon: recipeMetadataIcons.recipeYield,
        render: value => (value != null ? formatYield(value) : null),
    }),

    defineRecipeMetadata({
        key: "cuisine",
        icon: recipeMetadataIcons.cuisine,
        label: getTranslation("cuisine"),
        render: value => (value && value.length > 0 ? <RecipeMetadataFilterChips values={value} filterKey="cuisine" /> : null),
    }),
    defineRecipeMetadata({
        key: "calories",
        icon: recipeMetadataIcons.calories,
        label: getTranslation("calories"),

        render: value => (value != null ? value : null),
    }),

    defineRecipeMetadata({
        key: "dietary",
        icon: recipeMetadataIcons.dietary,
        label: getTranslation("dietary"),
        render: value => (value && value.length > 0 ? <RecipeMetadataFilterChips values={value} filterKey="dietary" /> : null),
    }),

    defineRecipeMetadata({
        key: "tags",
        icon: recipeMetadataIcons.tags,
        label: getTranslation("tags"),
        render: value => (value && value.length > 0 ? <RecipeMetadataFilterChips values={value} filterKey="tags" /> : null),
    }),
    defineRecipeMetadata({
        key: "totalWeight",
        icon: recipeMetadataIcons.totalWeight,
        label: getTranslation("totalWeight"),
        render: value => (value != null ? value : null),
    }),
] as const;
