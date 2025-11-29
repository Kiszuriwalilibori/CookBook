// import { fieldTranslations } from "@/lib/types";
// import { FilterableRecipeKeys, FilterState, RecipeFilter } from "@/types";

// const GENERAL_PLACEHOLDER = "Wszystkie";
// const DIETARY_PLACEHOLDER = "Bez ograniczeń";
// const KIZIA_PLACEHOLDER = "Kizia to lubi?";

// const PLACEHOLDERS: Record<FilterableRecipeKeys, string> = {
//     title: GENERAL_PLACEHOLDER,
//     cuisine: GENERAL_PLACEHOLDER,
//     tags: GENERAL_PLACEHOLDER,
//     dietary: DIETARY_PLACEHOLDER,
//     products: GENERAL_PLACEHOLDER,
//     Kizia: KIZIA_PLACEHOLDER,
//     "source.http": GENERAL_PLACEHOLDER,
//     "source.book": GENERAL_PLACEHOLDER,
//     "source.title": GENERAL_PLACEHOLDER,
//     "source.author": GENERAL_PLACEHOLDER,
//     "source.where": GENERAL_PLACEHOLDER,
// };
// type Renderer = "autocomplete" | "switch";
// export interface FilterField {
//     key: keyof FilterState;
//     label: string;
//     multiple: boolean;
//     chips?: boolean;
//     options: string[];
//     placeholder?: string;
//     requiredAdmin?: boolean;
//     component: Renderer;
// }

// function defineField(config: Partial<FilterField> & { key: FilterableRecipeKeys; multiple: boolean }) {
//     return {
//         // Defaults and overrides
//         component: "autocomplete",
//         options: INITIAL_OPTIONS,
//         requiredAdmin: false,
//         // Merge provided config
//         ...config,
//         // Computed fields (always override if not provided)
//         label: fieldTranslations[config.key],
//         placeholder: PLACEHOLDERS[config.key],
//     } as FilterField; // Explicit cast to ensure full type compliance
// }

// const INITIAL_OPTIONS: string[] = [];

// const BASE_FILTER_FIELDS: FilterField[] = [
//     defineField({ key: "title", multiple: false }),
//     defineField({ key: "cuisine", multiple: false }),
//     defineField({ key: "tags", multiple: true, chips: true }),
//     defineField({ key: "dietary", multiple: true, chips: true }),
//     defineField({ key: "products", multiple: true, chips: true }),
//     defineField({ key: "Kizia", multiple: false, component: "switch", requiredAdmin: true }),
// ] as const;

// const sanitizeOptions = (arr: unknown): string[] => (Array.isArray(arr) ? arr.filter((item): item is string => typeof item === "string" && item.trim() !== "") : []);

// export const useCreateRecipeFilterFields = (options: RecipeFilter) => {
//     return BASE_FILTER_FIELDS.map(base => ({
//         ...base,
//         options: base.component === "autocomplete" ? sanitizeOptions(options[base.key as keyof RecipeFilter]) : base.options,
//     }));
// };

// export default useCreateRecipeFilterFields;

// import { fieldTranslations } from "@/lib/types";
import { BASE_FILTER_FIELDS } from "@/models/filters";
import { /* FilterableRecipeKeys,*/ FilterState, RecipeFilter } from "@/types";

// const GENERAL_PLACEHOLDER = "Wszystkie";

// const PLACEHOLDERS: Record<FilterableRecipeKeys, string> = {
//     title: GENERAL_PLACEHOLDER,
//     cuisine: GENERAL_PLACEHOLDER,
//     tags: GENERAL_PLACEHOLDER,
//     dietary: "Bez ograniczeń",
//     products: GENERAL_PLACEHOLDER,
//     Kizia: "Kizia to lubi?",
//     "source.http": "Link",
//     "source.book": "Tytuł książki",
//     "source.title": "Autor książki",
//     "source.author": "Autor książki",
//     "source.where": "Katalog",
// };

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

// const INITIAL_OPTIONS: string[] = [];

/**
 * Type-safe field definition
 */
// function defineField(config: Partial<FilterField> & { key: FilterableRecipeKeys; multiple: boolean }) {
//     return {
//         component: "autocomplete",
//         options: INITIAL_OPTIONS,
//         requiredAdmin: false,
//         ...config,
//         label: fieldTranslations[config.key],
//         placeholder: PLACEHOLDERS[config.key],
//     } as FilterField;
// }

// export const BASE_FILTER_FIELDS: FilterField[] = [
//     defineField({ key: "title", multiple: false }),
//     defineField({ key: "cuisine", multiple: false }),
//     defineField({ key: "tags", multiple: true, chips: true }),
//     defineField({ key: "dietary", multiple: true, chips: true }),
//     defineField({ key: "products", multiple: true, chips: true }),
//     defineField({ key: "Kizia", multiple: false, component: "switch", requiredAdmin: true }),
//     defineField({ key: "source.http", multiple: false, requiredAdmin: true }),
//     defineField({ key: "source.book", multiple: false, requiredAdmin: true }),
//     defineField({ key: "source.title", multiple: false, requiredAdmin: true }),
//     defineField({ key: "source.author", multiple: false, requiredAdmin: true }),
//     defineField({ key: "source.where", multiple: false, requiredAdmin: true }),
// ] as const;

/**
 * Sanitize options for autocomplete fields
 */
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
