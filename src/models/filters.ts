
import { FilterField } from "@/hooks/useCreateRecipeFilterFields";
import { fieldTranslations } from "@/lib/types";
import { FilterableRecipeKeys } from "@/types";

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

export const BASE_FILTER_FIELDS: FilterField[] = [
    defineField({ key: "title", multiple: false }),
    defineField({ key: "cuisine", multiple: false }),
    defineField({ key: "tags", multiple: true, chips: true }),
    defineField({ key: "dietary", multiple: true, chips: true, placeholder: "Bez ograniczeń" }),
    defineField({ key: "products", multiple: true, chips: true }),

    defineField({
        key: "Kizia",
        multiple: false,
        component: "switch",
        requiredAdmin: true,
        placeholder: "Kizia to lubi?",
    }),

    defineField({ key: "source.http", multiple: false, requiredAdmin: true, placeholder: "Link" }),
    defineField({ key: "source.book", multiple: false, requiredAdmin: true, placeholder: "Tytuł książki" }),
    defineField({ key: "source.title", multiple: false, requiredAdmin: true, placeholder: "Tytuł książki" }),
    defineField({ key: "source.author", multiple: false, requiredAdmin: true, placeholder: "Autor książki" }),
    defineField({ key: "source.where", multiple: false, requiredAdmin: true, placeholder: "Katalog" }),
] as const;
