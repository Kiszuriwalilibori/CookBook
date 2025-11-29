// import { useState, useEffect, useCallback, useMemo } from "react";
// import { z } from "zod";
// import { useDebouncedCallback } from "./useDebouncedCallback";
// import { normalizeMultiple } from "@/components/RecipeFilters/utils/normalize";
// import { RecipeFilter } from "@/types";
// import isEqual from "lodash/isEqual";

// const initialFilters: FilterState = {
//     title: "",
//     cuisine: "",
//     tags: [],
//     dietary: [],
//     products: [],
//     Kizia: true,
// };

// const MAX_TAGS = 10;

// const EMPTY_ERRORS: Record<keyof FilterState, string> = {
//     title: "",
//     cuisine: "",
//     tags: "",
//     dietary: "",
//     products: "",
//     Kizia: "",
// };

// const FilterSchema = z.object({
//     title: z.string().default(""),
//     cuisine: z.string().default(""),
//     tags: z.array(z.string()).max(MAX_TAGS, `Maksymalnie ${MAX_TAGS} tagów`),
//     dietary: z.array(z.string()),
//     products: z.array(z.string()),
//     Kizia: z.boolean().default(true),
// });
// export type FilterValuesTypes = z.infer<typeof FilterSchema>[keyof z.infer<typeof FilterSchema>];
// export type FilterState = z.infer<typeof FilterSchema>;
// type Normalizers = {
//     [K in keyof FilterState]: (value: FilterState[K]) => FilterState[K];
// };

// export const useFilters = (options: RecipeFilter, onFiltersChange: (filters: FilterState) => void) => {
//     const [filters, setFilters] = useState<FilterState>(initialFilters);
//     const normalizers = useMemo<Normalizers>(
//         () => ({
//             title: val => val.trim().toLowerCase(),
//             cuisine: val => val.trim().toLowerCase(),
//             tags: val => normalizeMultiple(val, options.tags),
//             dietary: val => normalizeMultiple(val, options.dietary),
//             products: val => normalizeMultiple(val, options.products),
//             Kizia: val => val,
//         }),
//         [options]
//     );
//     const [errors, setErrors] = useState<Record<keyof FilterState, string>>(EMPTY_ERRORS);

//     const applyFiltersInternal = useCallback(
//         (newFilters: FilterState) => {
//             onFiltersChange(newFilters);
//         },
//         [onFiltersChange]
//     );

//     const { debounced: debouncedApplyFilters, flush: flushApplyFilters } = useDebouncedCallback(applyFiltersInternal, 500);

//     const handleChange = useCallback(
//         <K extends keyof FilterState>(key: K, value: FilterState[K]): void => {
//             setFilters(prev => {
//                 const updated = { ...prev };
//                 updated[key] = normalizers[key](value);
//                 debouncedApplyFilters(updated);
//                 return updated;
//             });
//         },
//         [normalizers, debouncedApplyFilters]
//     );

//     useEffect(() => {
//         if (options.tags.length === 0) return; // Skip if options not loaded yet

//         setFilters(prev => {
//             const normalized = { ...prev };
//             const multipleKeys: ("tags" | "dietary" | "products")[] = ["tags", "dietary", "products"];
//             multipleKeys.forEach(key => {
//                 const optionsKey = key === "tags" ? "tags" : key === "dietary" ? "dietary" : "products";
//                 const currentValue = prev[key];
//                 normalized[key] = normalizeMultiple(currentValue as string[], options[optionsKey as keyof typeof options] as string[]);
//             });

//             const isDifferent = multipleKeys.some(key => !isEqual(normalized[key], prev[key]));

//             if (isDifferent) {
//                 debouncedApplyFilters(normalized);
//                 return normalized;
//             }
//             return prev;
//         });
//     }, [options, debouncedApplyFilters]);

//     const apply = useCallback(() => {
//         flushApplyFilters(); // Immediately flush any pending debounced call
//         const result = FilterSchema.safeParse(filters);
//         if (!result.success) {
//             const newErrors: Record<keyof FilterState, string> = { ...EMPTY_ERRORS };
//             result.error.errors.forEach(err => {
//                 const key = err.path[0];
//                 if (typeof key === "string") newErrors[key as keyof FilterState] = err.message;
//             });
//             setErrors(newErrors);
//             return false;
//         }

//         setErrors(EMPTY_ERRORS);
//         onFiltersChange(result.data);
//         return true;
//     }, [filters, flushApplyFilters, onFiltersChange]);

//     const clear = useCallback(() => {
//         setFilters(initialFilters);
//         setErrors(EMPTY_ERRORS);
//         onFiltersChange(initialFilters);
//     }, [onFiltersChange]);

//     return { filters, errors, handleChange, clear, apply };
// };


import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebouncedCallback } from "./useDebouncedCallback";
import { normalizeMultiple } from "@/components/RecipeFilters/utils/normalize";
import { RecipeFilter } from "@/types";
import isEqual from "lodash/isEqual";

const MAX_TAGS = 10;

export type FilterState = {
    title: string;
    cuisine: string;
    tags: string[];
    dietary: string[];
    products: string[];
    Kizia: boolean;
};

const initialFilters: FilterState = {
    title: "",
    cuisine: "",
    tags: [],
    dietary: [],
    products: [],
    Kizia: true,
};

const EMPTY_ERRORS: Record<keyof FilterState, string> = {
    title: "",
    cuisine: "",
    tags: "",
    dietary: "",
    products: "",
    Kizia: "",
};

type Normalizers = {
    [K in keyof FilterState]: (value: FilterState[K]) => FilterState[K];
};

export const useFilters = (options: RecipeFilter, onFiltersChange: (filters: FilterState) => void) => {
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [errors, setErrors] = useState<Record<keyof FilterState, string>>(EMPTY_ERRORS);

    const normalizers = useMemo<Normalizers>(
        () => ({
            title: val => (val as string).trim().toLowerCase(),
            cuisine: val => (val as string).trim().toLowerCase(),
            tags: val => normalizeMultiple(val as string[], options.tags),
            dietary: val => normalizeMultiple(val as string[], options.dietary),
            products: val => normalizeMultiple(val as string[], options.products),
            Kizia: val => val,
        }),
        [options]
    );

    const applyFiltersInternal = useCallback(
        (newFilters: FilterState) => {
            onFiltersChange(newFilters);
        },
        [onFiltersChange]
    );

    const { debounced: debouncedApplyFilters, flush: flushApplyFilters } = useDebouncedCallback(applyFiltersInternal, 500);

    const handleChange = useCallback(
        <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
            setFilters(prev => {
                const updated = { ...prev, [key]: normalizers[key](value) };
                debouncedApplyFilters(updated);
                return updated;
            });
        },
        [normalizers, debouncedApplyFilters]
    );

    // Normalize multiple-value filters when options change
    useEffect(() => {
        if (options.tags.length === 0) return;

        setFilters(prev => {
            const updated = { ...prev };
            const multiKeys: ("tags" | "dietary" | "products")[] = ["tags", "dietary", "products"];

            multiKeys.forEach(key => {
                const optionValues = options[key];
                updated[key] = normalizeMultiple(prev[key], optionValues);
            });

            const changed = multiKeys.some(key => !isEqual(updated[key], prev[key]));

            if (changed) {
                debouncedApplyFilters(updated);
                return updated;
            }
            return prev;
        });
    }, [options, debouncedApplyFilters]);

    // Apply manually with validation
    const apply = useCallback(() => {
        flushApplyFilters();

        const newErrors: Record<keyof FilterState, string> = { ...EMPTY_ERRORS };
        let valid = true;

        if (filters.tags.length > MAX_TAGS) {
            newErrors.tags = `Maksymalnie ${MAX_TAGS} tagów`;
            valid = false;
        }

        if (!valid) {
            setErrors(newErrors);
            return false;
        }

        setErrors(EMPTY_ERRORS);
        onFiltersChange(filters);
        return true;
    }, [filters, flushApplyFilters, onFiltersChange]);

    const clear = useCallback(() => {
        setFilters(initialFilters);
        setErrors(EMPTY_ERRORS);
        onFiltersChange(initialFilters);
    }, [onFiltersChange]);

    return { filters, errors, handleChange, clear, apply };
};
