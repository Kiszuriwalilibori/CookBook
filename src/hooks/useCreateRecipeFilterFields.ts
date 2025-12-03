import { FILTER_FIELDS_CONFIG, FilterState } from "@/models/filters";
import { RecipeFilter } from "@/types";

type Renderer = "autocomplete" | "switch" | "checkbox";

export interface FilterField {
    key: keyof FilterState;
    label: string;
    multiple: boolean;
    chips?: boolean;
    options: string[];
    placeholder?: string;
    requiredAdmin?: boolean;
    component: Renderer;
}

const sanitizeOptions = (arr: unknown): string[] => (Array.isArray(arr) ? arr.filter((item): item is string => typeof item === "string" && item.trim() !== "") : []);

/**
 * Hook to create type-safe filter fields for UI
 */
export const useCreateRecipeFilterFields = (options: RecipeFilter) => {
    return FILTER_FIELDS_CONFIG.map(base => ({
        ...base,
        options: base.component === "autocomplete" ? sanitizeOptions(options[base.key as keyof RecipeFilter]) : base.options,
    }));
};

export default useCreateRecipeFilterFields;
