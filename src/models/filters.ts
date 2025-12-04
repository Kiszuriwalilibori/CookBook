import { FilterField } from "@/hooks/useCreateRecipeFilterFields";
import { fieldTranslations } from "@/types";
import { BaseFilterableKeys, FilterableRecipeKeys, SourceKeys, Status } from "@/types";

const INITIAL_OPTIONS: string[] = [];
const GENERAL_PLACEHOLDER = "Wszystkie";

export function defineField(config: Partial<FilterField> & { key: FilterableRecipeKeys; multiple: boolean }) {
    return {
        component: "autocomplete",
        options: INITIAL_OPTIONS,
        requiredAdmin: false,
        placeholder: GENERAL_PLACEHOLDER,
        ...config,
        label: fieldTranslations[config.key],
    } as FilterField;
}

export const FILTER_FIELDS_CONFIG: FilterField[] = [
    defineField({ key: "title", multiple: false }),
    defineField({ key: "cuisine", multiple: false }),
    defineField({ key: "tags", multiple: true, chips: true }),
    defineField({ key: "dietary", multiple: true, chips: true, placeholder: "Bez ograniczeń" }),
    defineField({ key: "products", multiple: true, chips: true }),
    defineField({ key: "Kizia", multiple: false, component: "switch", requiredAdmin: true, placeholder: "Kizia to lubi?" }),
    defineField({ key: "status", multiple: false, component: "checkbox", requiredAdmin: true, placeholder: "Status" }),
    defineField({ key: "source.http", multiple: false, requiredAdmin: true, placeholder: "Link" }),
    defineField({ key: "source.book", multiple: false, requiredAdmin: true, placeholder: "Tytuł książki" }),
    defineField({ key: "source.title", multiple: false, requiredAdmin: true, placeholder: "Tytuł książki" }),
    defineField({ key: "source.author", multiple: false, requiredAdmin: true, placeholder: "Autor książki" }),
    defineField({ key: "source.where", multiple: false, requiredAdmin: true, placeholder: "Katalog" }),
] as const;
export type FilterValuesTypes = FilterState[keyof FilterState];

export type FilterState = {
    [K in BaseFilterableKeys]: K extends "title" | "cuisine" ? string : K extends "status" ? Status | null : K extends "Kizia" ? boolean : string[];
} & {
    [K in SourceKeys]: string;
};

export type ChipEligibleKey = {
    [K in keyof FilterState]: FilterState[K] extends string[] ? K : never;
}[keyof FilterState];
