import { FilterField } from "@/hooks/useCreateRecipeFilterFields";
import { BaseFilterableKeys, FilterableRecipeKeys, SourceKeys, Status } from "@/types";
import { getTranslation } from "./fieldTranslations";

const INITIAL_OPTIONS: string[] = [];
const GENERAL_PLACEHOLDER = "Wszystkie";

export function defineField(config: Partial<FilterField> & { key: FilterableRecipeKeys; multiple: boolean }) {
    return {
        component: "autocomplete",
        options: INITIAL_OPTIONS,
        requiredAdmin: false,
        placeholder: GENERAL_PLACEHOLDER,
        ...config,
        label: getTranslation(config.key),
    } as FilterField;
}

export const FILTER_FIELDS_CONFIG: FilterField[] = [
    defineField({ key: "title", multiple: false }),
    defineField({ key: "cuisine", multiple: true, chips: true }),
    defineField({ key: "tags", multiple: true, chips: true }),
    defineField({ key: "dietary", multiple: true, chips: true, placeholder: "Bez ograniczeń" }),
    defineField({ key: "products", multiple: true, chips: true }),
    defineField({ key: "kizia", multiple: false, component: "switch", requiredAdmin: true, placeholder: "Kizia to lubi?" }),
    defineField({ key: "status", multiple: true, component: "checkbox", requiredAdmin: true, placeholder: "Status" }),
    defineField({ key: "source.url", multiple: false, requiredAdmin: true, placeholder: "Link" }),
    defineField({ key: "source.book", multiple: false, requiredAdmin: true, placeholder: "Tytuł książki" }),
    defineField({ key: "source.title", multiple: false, requiredAdmin: true, placeholder: "Tytuł książki" }),
    defineField({ key: "source.author", multiple: false, requiredAdmin: true, placeholder: "Autor książki" }),
    defineField({ key: "source.where", multiple: false, requiredAdmin: true, placeholder: "Katalog" }),
] as const;
export type FilterValuesTypes = FilterState[keyof FilterState];

export type FilterState = {
    [K in BaseFilterableKeys]: K extends "title" ? string : K extends "status" ? Status[] : K extends "kizia" ? boolean : string[];
} & {
    [K in SourceKeys]: string;
};

export type ChipEligibleKey = {
    [K in keyof FilterState]: FilterState[K] extends string[] ? K : never;
}[keyof FilterState];

export type ActualChipKey = Exclude<ChipEligibleKey, "status">;