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
interface FilterField {
    key: keyof FilterState;
    label: string;
    multiple: boolean;
    chips?: boolean;
    options: string[];
    placeholder?: string;
    isAdmin?: boolean;
    component: Renderer;
}

function defineField<K extends FilterableRecipeKeys>(config: { key: K; multiple: boolean; chips?: boolean; component?: Renderer }) {
    return {
        key: config.key,
        multiple: config.multiple,
        chips: config.chips,
        label: fieldTranslations[config.key],
        placeholder: PLACEHOLDERS[config.key],
        component: config.component ?? "autocomplete",
        options: INITIAL_OPTIONS,
    };
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
