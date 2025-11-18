// import { fieldTranslations } from "@/lib/types";
// import { FilterState, Options } from "@/types";
// import { useMemo } from "react";

// const GENERAL_PLACEHOLDER = "Wszystkie";
// const DIETARY_PLACEHOLDER = "Bez ograniczeń";

// const BASE_FILTER_FIELDS = [
//     { key: "title", label: fieldTranslations.title, multiple: false, placeholder: GENERAL_PLACEHOLDER },
//     { key: "cuisine", label: fieldTranslations.cuisine, multiple: false, placeholder: GENERAL_PLACEHOLDER },
//     { key: "tag", label: fieldTranslations.tags, multiple: true, chips: true, placeholder: GENERAL_PLACEHOLDER },
//     { key: "dietary", label: fieldTranslations.dietary, multiple: true, chips: true, placeholder: DIETARY_PLACEHOLDER },
//     { key: "product", label: fieldTranslations.product, multiple: true, chips: true, placeholder: GENERAL_PLACEHOLDER },
// ] as const;

// interface FilterField {
//     key: keyof FilterState;
//     label: string;
//     multiple: boolean;
//     chips?: boolean;
//     options: string[];
//     placeholder?: string;
// }

// const sanitizeOptions = (arr: unknown): string[] => {
//     if (!Array.isArray(arr)) return [];
//     return arr.filter((item): item is string => typeof item === "string" && item.trim() !== "");
// };

// const createOptions =(base, options: Options)=>{
//     return base.key === "dietary" ? options[`${base.key}` as keyof Options] : options[`${base.key}s` as keyof Options];
// }

// export const useCreateRecipeFilterFields = (options: Options) => {
//     const filterFields: FilterField[] = useMemo(
//         () =>
//             BASE_FILTER_FIELDS.map(base => {
//                 // const rawOptions = base.key === "dietary" ? options[`${base.key}` as keyof Options] : options[`${base.key}s` as keyof Options];
//                 const rawOptions = createOptions(base, options);
//                 return {
//                     ...base,
//                     options: sanitizeOptions(rawOptions),
//                 };
//             }),
//         [options]
//     );

//     return filterFields;
// };

// export default useCreateRecipeFilterFields;

import { fieldTranslations } from "@/lib/types";
import { FilterState, Options } from "@/types";
import { useMemo } from "react";

const GENERAL_PLACEHOLDER = "Wszystkie";
const DIETARY_PLACEHOLDER = "Bez ograniczeń";

const BASE_FILTER_FIELDS = [
    { key: "title", label: fieldTranslations.title, multiple: false, placeholder: GENERAL_PLACEHOLDER },
    { key: "cuisine", label: fieldTranslations.cuisine, multiple: false, placeholder: GENERAL_PLACEHOLDER },
    { key: "tag", label: fieldTranslations.tags, multiple: true, chips: true, placeholder: GENERAL_PLACEHOLDER },
    { key: "dietary", label: fieldTranslations.dietary, multiple: true, chips: true, placeholder: DIETARY_PLACEHOLDER },
    { key: "product", label: fieldTranslations.product, multiple: true, chips: true, placeholder: GENERAL_PLACEHOLDER },
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

export const useCreateRecipeFilterFields = (options: Options) => {
    const filterFields = useMemo<FilterField[]>(() => {
        return BASE_FILTER_FIELDS.map(baseFilterField => {
            const rawOptions = baseFilterField.key === "dietary" ? options.dietary : options[`${baseFilterField.key}s` as const]; // `as const` makes it a literal key

            return {
                ...baseFilterField,
                options: sanitizeOptions(rawOptions),
            };
        });
    }, [options]);

    return filterFields;
};

export default useCreateRecipeFilterFields;
