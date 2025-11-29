import { FilterField } from "@/hooks/useCreateRecipeFilterFields";
import { fieldTranslations } from "@/lib/types";
import { BaseFilterableKeys, FilterableRecipeKeys, SourceKeys } from "@/types";


const INITIAL_OPTIONS: string[] = [];





const GENERAL_PLACEHOLDER = "Wszystkie";

export const PLACEHOLDERS: Record<FilterableRecipeKeys, string> = {
    title: GENERAL_PLACEHOLDER,
    cuisine: GENERAL_PLACEHOLDER,
    tags: GENERAL_PLACEHOLDER,
    dietary: "Bez ograniczeń",
    products: GENERAL_PLACEHOLDER,
    Kizia: "Kizia to lubi?",
    "source.http": "Link",
    "source.book": "Tytuł książki",
    "source.title": "Autor książki",
    "source.author": "Autor książki",
    "source.where": "Katalog",
};



export function defineField(config: Partial<FilterField> & { key: FilterableRecipeKeys; multiple: boolean }) {
    return {
        component: "autocomplete",
        options: INITIAL_OPTIONS,
        requiredAdmin: false,
        ...config,
        label: fieldTranslations[config.key],
        placeholder: PLACEHOLDERS[config.key],
    } as FilterField;
}


export const BASE_FILTER_FIELDS: FilterField[] = [
    defineField({ key: "title", multiple: false }),
    defineField({ key: "cuisine", multiple: false }),
    defineField({ key: "tags", multiple: true, chips: true }),
    defineField({ key: "dietary", multiple: true, chips: true }),
    defineField({ key: "products", multiple: true, chips: true }),
    defineField({ key: "Kizia", multiple: false, component: "switch", requiredAdmin: true }),
    defineField({ key: "source.http", multiple: false, requiredAdmin: true }),
    defineField({ key: "source.book", multiple: false, requiredAdmin: true }),
    defineField({ key: "source.title", multiple: false, requiredAdmin: true }),
    defineField({ key: "source.author", multiple: false, requiredAdmin: true }),
    defineField({ key: "source.where", multiple: false, requiredAdmin: true }),
] as const;
