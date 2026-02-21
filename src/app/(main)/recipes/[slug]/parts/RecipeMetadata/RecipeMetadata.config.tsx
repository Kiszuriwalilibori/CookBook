import { getTranslation } from "@/models/fieldTranslations";
import { RecipeMetadataConfigItem, RecipeMetadataFlat } from "./RecipeMetadata.types";
import { formatArray, formatMinutes, formatYield } from "./RecipeMetadata.utils";
import{ RecipeMetadataTagChips} from "./RecipeMetadataTagChips";


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
        format: value => (value != null ? formatArray(value) : null),
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
        format: value => (value != null ? formatArray(value) : null),
    }),
    // defineRecipeMetadata({
    //     key: "tags",
    //     icon: "🏷️",
    //     label: getTranslation("tags"),
    //     format: value => (value != null ? formatArray(value) : null),
    // }),
    defineRecipeMetadata({
        key: "tags",
        icon: "🏷️",
        label: getTranslation("tags"),
        format: value => (value && value.length > 0 ? <RecipeMetadataTagChips tags={value} /> : null),
    }),
    defineRecipeMetadata({
        key: "totalWeight",
        icon: "⚖️",
        label: getTranslation("totalWeight"),
        format: value => (value != null ? value : null),
    }),
] as const;
