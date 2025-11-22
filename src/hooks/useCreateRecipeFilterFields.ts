import { fieldTranslations } from "@/lib/types";
import { FilterState, RecipeFilter } from "@/types";
import { useMemo } from "react";

const GENERAL_PLACEHOLDER = "Wszystkie";
const DIETARY_PLACEHOLDER = "Bez ograniczeń";

interface FilterField {
    key: keyof FilterState;
    label: string;
    multiple: boolean;
    chips?: boolean;
    options: string[];
    placeholder?: string;
}

type BaseFilterField = Omit<FilterField, "options">;

const BASE_FILTER_FIELDS: BaseFilterField[] = [
    { key: "title", label: fieldTranslations.title, multiple: false, placeholder: GENERAL_PLACEHOLDER },
    { key: "cuisine", label: fieldTranslations.cuisine, multiple: false, placeholder: GENERAL_PLACEHOLDER },
    { key: "tags", label: fieldTranslations.tags, multiple: true, chips: true, placeholder: GENERAL_PLACEHOLDER },
    { key: "dietary", label: fieldTranslations.dietary, multiple: true, chips: true, placeholder: DIETARY_PLACEHOLDER },
    { key: "products", label: fieldTranslations.products, multiple: true, chips: true, placeholder: GENERAL_PLACEHOLDER },
] as const;

const sanitizeOptions = (arr: unknown): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item): item is string => typeof item === "string" && item.trim() !== "");
};

export const useCreateRecipeFilterFields = (options: RecipeFilter) => {
    const filterFields = useMemo<FilterField[]>(() => {
        return BASE_FILTER_FIELDS.map(baseFilterField => {
            const rawOptions = options[baseFilterField.key];
            return {
                ...baseFilterField,
                options: sanitizeOptions(rawOptions),
            };
        });
    }, [options]);

    return filterFields;
};

export default useCreateRecipeFilterFields;
