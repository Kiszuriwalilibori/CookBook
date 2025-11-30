import { BASE_FILTER_FIELDS } from "@/models/filters";
import {FilterState, RecipeFilter } from "@/types";


type Renderer = "autocomplete" | "switch";

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
    return BASE_FILTER_FIELDS.map(base => ({
        ...base,
        options: base.component === "autocomplete" ? sanitizeOptions(options[base.key as keyof RecipeFilter]) : base.options,
    }));
};

export default useCreateRecipeFilterFields;
