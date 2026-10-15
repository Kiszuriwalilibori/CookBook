// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useDebouncedCallback } from "./useDebouncedCallback";
// import { normalizeMultiple } from "@/components/RecipeFilters/utils/normalize";
// import { RecipeFilter, Status } from "@/types";
// import isEqual from "lodash/isEqual";
// import { FilterState } from "@/models/filters";

// const MAX_TAGS = 10;

// export const initialFilters: FilterState = {
//     title: "",
//     cuisine: [],
//     tags: [],
//     dietary: [],
//     products: [],
//     status: [],
//     kizia: false,
//     "source.url": "",
//     "source.book": "",
//     "source.title": "",
//     "source.author": "",
//     "source.where": "",
// };

// const EMPTY_ERRORS: Record<keyof FilterState, string> = {
//     title: "",
//     cuisine: "",
//     tags: "",
//     dietary: "",
//     products: "",
//     kizia: "",
//     status: "",
//     "source.url": "",
//     "source.book": "",
//     "source.title": "",
//     "source.author": "",
//     "source.where": "",
// };

// type Normalizers = {
//     [K in keyof FilterState]: (value: FilterState[K]) => FilterState[K];
// };

// export const useFilters = (options: RecipeFilter, onFiltersChange: (filters: FilterState) => void, initialValues: FilterState = initialFilters) => {
//     const [filters, setFilters] = useState<FilterState>(initialValues);
//     const [errors, setErrors] = useState<Record<keyof FilterState, string>>(EMPTY_ERRORS);

//     const normalizers = useMemo<Normalizers>(
//         () => ({
//             title: val => (val as string).trim().toLowerCase(),
//             cuisine: val => normalizeMultiple(val as string[], options.cuisine),
//             tags: val => normalizeMultiple(val as string[], options.tags),
//             dietary: val => normalizeMultiple(val as string[], options.dietary),
//             products: val => normalizeMultiple(val as string[], options.products),

//             status: val => val as Status[],
//             kizia: val => val,
//             "source.url": val => (val as string).trim().toLowerCase(),
//             "source.book": val => (val as string).trim().toLowerCase(),
//             "source.title": val => (val as string).trim().toLowerCase(),
//             "source.author": val => (val as string).trim().toLowerCase(),
//             "source.where": val => (val as string).trim().toLowerCase(),
//         }),
//         [options]
//     );

//     const applyFiltersInternal = useCallback(
//         (newFilters: FilterState) => {
//             onFiltersChange(newFilters);
//         },
//         [onFiltersChange]
//     );

//     const { debounced: debouncedApplyFilters, flush: flushApplyFilters } = useDebouncedCallback(applyFiltersInternal, 500);

//     const handleChange = useCallback(
//         <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
//             setFilters(prev => {
//                 const updated = { ...prev, [key]: normalizers[key](value) };
//                 debouncedApplyFilters(updated);
//                 return updated;
//             });
//         },
//         [normalizers, debouncedApplyFilters]
//     );

//     // Normalize multiple-value filters when options change
//     useEffect(() => {
//         if (options.tags.length === 0) return;

//         setFilters(prev => {
//             const updated = { ...prev };
//             const multiKeys: ("tags" | "dietary" | "products")[] = ["tags", "dietary", "products"];

//             multiKeys.forEach(key => {
//                 const optionValues = options[key];
//                 updated[key] = normalizeMultiple(prev[key], optionValues);
//             });

//             const changed = multiKeys.some(key => !isEqual(updated[key], prev[key]));

//             if (changed) {
//                 debouncedApplyFilters(updated);
//                 return updated;
//             }
//             return prev;
//         });
//     }, [options, debouncedApplyFilters]);

//     const apply = useCallback(() => {
//         flushApplyFilters();

//         const newErrors: Record<keyof FilterState, string> = { ...EMPTY_ERRORS };
//         let valid = true;

//         if (filters.tags.length > MAX_TAGS) {
//             newErrors.tags = `Maksymalnie ${MAX_TAGS} tagów`;
//             valid = false;
//         }

//         if (!valid) {
//             setErrors(newErrors);
//             return false;
//         }

//         setErrors(EMPTY_ERRORS);
//         onFiltersChange(filters);
//         return true;
//     }, [filters, flushApplyFilters, onFiltersChange]);

//     const clear = useCallback(() => {
//         setFilters(initialFilters);
//         setErrors(EMPTY_ERRORS);
//         onFiltersChange(initialFilters);
//     }, [onFiltersChange]);

//     return { filters, errors, handleChange, clear, apply };
// };

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { normalizeMultiple } from "@/components/RecipeFilters/utils/normalize";
import { RecipeFilter, Status } from "@/types";
import isEqual from "lodash/isEqual";
import type { FilterState } from "@/models/filters";

const MAX_TAGS = 10;

export const initialFilters: FilterState = {
    title: "",
    cuisine: [],
    tags: [],
    dietary: [],
    products: [],
    status: [],
    kizia: false,
    "source.url": "",
    "source.book": "",
    "source.title": "",
    "source.author": "",
    "source.where": "",
};

const EMPTY_ERRORS: Record<keyof FilterState, string> = {
    title: "",
    cuisine: "",
    tags: "",
    dietary: "",
    products: "",
    kizia: "",
    status: "",
    "source.url": "",
    "source.book": "",
    "source.title": "",
    "source.author": "",
    "source.where": "",
};

type Normalizers = {
    [K in keyof FilterState]: (value: FilterState[K]) => FilterState[K];
};

export const useFilters = (options: RecipeFilter, onFiltersChange: (filters: FilterState) => void, initialValues: FilterState = initialFilters) => {
    const [filters, setFilters] = useState<FilterState>(initialValues);
    const [errors, setErrors] = useState<Record<keyof FilterState, string>>(EMPTY_ERRORS);

    const normalizers = useMemo<Normalizers>(
        () => ({
            title: val => (val as string).trim().toLowerCase(),
            cuisine: val => normalizeMultiple(val as string[], options.cuisine),
            tags: val => normalizeMultiple(val as string[], options.tags),
            dietary: val => normalizeMultiple(val as string[], options.dietary),
            products: val => normalizeMultiple(val as string[], options.products),
            status: val => val as Status[],
            kizia: val => val,
            "source.url": val => (val as string).trim().toLowerCase(),
            "source.book": val => (val as string).trim().toLowerCase(),
            "source.title": val => (val as string).trim().toLowerCase(),
            "source.author": val => (val as string).trim().toLowerCase(),
            "source.where": val => (val as string).trim().toLowerCase(),
        }),
        [options]
    );

    const handleChange = useCallback(
        <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
            setFilters(prev => ({
                ...prev,
                [key]: normalizers[key](value),
            }));
        },
        [normalizers]
    );

    // Normalize multiple-value filters when options change.
    useEffect(() => {
        if (options.tags.length === 0) return;

        setFilters(prev => {
            const updated = { ...prev };
            const multiKeys = ["tags", "dietary", "products"] as const;

            multiKeys.forEach(key => {
                updated[key] = normalizeMultiple(prev[key], options[key]);
            });

            const changed = multiKeys.some(key => !isEqual(updated[key], prev[key]));

            return changed ? updated : prev;
        });
    }, [options]);

    const apply = useCallback(() => {
        const newErrors: Record<keyof FilterState, string> = { ...EMPTY_ERRORS };

        if (filters.tags.length > MAX_TAGS) {
            newErrors.tags = `Maksymalnie ${MAX_TAGS} tagów`;
            setErrors(newErrors);
            return false;
        }

        setErrors(EMPTY_ERRORS);
        onFiltersChange(filters);
        return true;
    }, [filters, onFiltersChange]);

    const clear = useCallback(() => {
        setFilters(initialFilters);
        setErrors(EMPTY_ERRORS);
        onFiltersChange(initialFilters);
    }, [onFiltersChange]);

    return { filters, errors, handleChange, clear, apply };
};
