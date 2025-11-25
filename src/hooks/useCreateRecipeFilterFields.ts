import { fieldTranslations } from "@/lib/types";
import { FilterableRecipeKeys, FilterState, RecipeFilter } from "@/types";

const GENERAL_PLACEHOLDER = "Wszystkie";
const DIETARY_PLACEHOLDER = "Bez ograniczeń";

const PLACEHOLDERS: Record<FilterableRecipeKeys, string> = {
    title: GENERAL_PLACEHOLDER,
    cuisine: GENERAL_PLACEHOLDER,
    tags: GENERAL_PLACEHOLDER,
    dietary: DIETARY_PLACEHOLDER,
    products: GENERAL_PLACEHOLDER,
};
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

function defineField(config: Partial<FilterField> & { key: FilterableRecipeKeys; multiple: boolean }) {
    return {
        // Defaults and overrides
        component: "autocomplete",
        options: INITIAL_OPTIONS,
        requiredAdmin: false,
        // Merge provided config
        ...config,
        // Computed fields (always override if not provided)
        label: fieldTranslations[config.key],
        placeholder: PLACEHOLDERS[config.key],
    } as FilterField; // Explicit cast to ensure full type compliance
}

const INITIAL_OPTIONS: string[] = [];

const BASE_FILTER_FIELDS: FilterField[] = [
    defineField({ key: "title", multiple: false }),
    defineField({ key: "cuisine", multiple: false }),
    defineField({ key: "tags", multiple: true, chips: true }),
    defineField({ key: "dietary", multiple: true, chips: true }),
    defineField({ key: "products", multiple: true, chips: true }),
] as const;

const sanitizeOptions = (arr: unknown): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item): item is string => typeof item === "string" && item.trim() !== "");
};

export const useCreateRecipeFilterFields = (options: RecipeFilter) => {
    return BASE_FILTER_FIELDS.map(base => ({
        ...base,
        options: sanitizeOptions(options[base.key]),
    }));
};

export default useCreateRecipeFilterFields;