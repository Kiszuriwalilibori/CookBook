import { fieldTranslations } from "@/lib/types";
import { FilterState, Options } from "@/types";
import { useMemo } from "react";
const BASE_FILTER_FIELDS = [
    { key: "title", label: fieldTranslations.title, multiple: false },
    { key: "cuisine", label: fieldTranslations.cuisine, multiple: false },
    { key: "tag", label: fieldTranslations.tags, multiple: true, chips: true },
    { key: "dietary", label: fieldTranslations.dietaryRestrictions, multiple: true, chips: true },
    { key: "product", label: fieldTranslations.product, multiple: true, chips: true },
] as const;

interface FilterField {
    key: keyof FilterState;
    label: string;
    multiple: boolean;
    chips?: boolean;
    options: string[];
    placeholder?: string;
}

const sanitizeOptions = (arr: unknown): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item): item is string => typeof item === "string" && item.trim() !== "");
};

export const useCreateRecipeFilterFields = (options: Options, dietaryOptions: Options["dietaryRestrictions"], productOptions: Options["products"]) => {
    const NO_DIETARY_RESTRICTIONS_LABEL = "Bez ograniczeń";
    const filterFields: FilterField[] = useMemo(
        () =>
            BASE_FILTER_FIELDS.map(base => {
                const rawOptions = base.key === "dietary" ? dietaryOptions.filter(o => o !== NO_DIETARY_RESTRICTIONS_LABEL) : base.key === "product" ? productOptions : options[`${base.key}s` as keyof Options];

                return {
                    ...base,
                    options: sanitizeOptions(rawOptions),
                    placeholder: base.key === "dietary" ? NO_DIETARY_RESTRICTIONS_LABEL : undefined,
                };
            }),
        [options, dietaryOptions, productOptions]
    );
    return filterFields;
};

export default useCreateRecipeFilterFields;
