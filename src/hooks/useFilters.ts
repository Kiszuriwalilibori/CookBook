import { useState, useEffect, useCallback, useMemo } from "react";
import { z } from "zod";
import { useDebouncedCallback } from "./useDebouncedCallback";
import { normalizeMultiple } from "@/components/RecipeFilters/utils/normalize";
import { RecipeFilter } from "@/types";
import isEqual from "lodash/isEqual";

const initialFilters: FilterState = {
    title: "",
    cuisine: "",
    tags: [],
    dietary: [],
    products: [],
};

const MAX_TAGS = 10;

const EMPTY_ERRORS: Record<keyof FilterState, string> = {
    title: "",
    cuisine: "",
    tags: "",
    dietary: "",
    products: "",
};

const FilterSchema = z.object({
    title: z.string().default(""),
    cuisine: z.string().default(""),
    tags: z.array(z.string()).max(MAX_TAGS, `Maksymalnie ${MAX_TAGS} tagów`),
    dietary: z.array(z.string()),
    products: z.array(z.string()),
});

export type FilterState = z.infer<typeof FilterSchema>;
type Normalizers = {
    [K in keyof FilterState]: (value: FilterState[K]) => FilterState[K];
};


export const useFilters = (options: RecipeFilter, onFiltersChange: (filters: FilterState) => void) => {
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const normalizers = useMemo<Normalizers>(
        () => ({
            title: val => val.trim().toLowerCase(),
            cuisine: val => val.trim().toLowerCase(),
            tags: val => normalizeMultiple(val, options.tags),
            dietary: val => normalizeMultiple(val, options.dietary),
            products: val => normalizeMultiple(val, options.products),
        }),
        [options]
    );
    const [errors, setErrors] = useState<Record<keyof FilterState, string>>(EMPTY_ERRORS);

    const applyFiltersInternal = useCallback(
        (newFilters: FilterState) => {
            onFiltersChange(newFilters);
        },
        [onFiltersChange]
    );

    const { debounced: debouncedApplyFilters, flush: flushApplyFilters } = useDebouncedCallback(applyFiltersInternal, 500);

    const handleChange = useCallback(
        <K extends keyof FilterState>(key: K, value: FilterState[K]): void => {
            setFilters(prev => {
                const updated = { ...prev };
                updated[key] = normalizers[key](value);
                debouncedApplyFilters(updated);
                return updated;
            });
        },
        [normalizers, debouncedApplyFilters]
    );

    useEffect(() => {
        if (options.tags.length === 0) return; // Skip if options not loaded yet

        setFilters(prev => {
            const normalized = { ...prev };
            const multipleKeys: ("tags" | "dietary" | "products")[] = ["tags", "dietary", "products"];
            multipleKeys.forEach(key => {
                const optionsKey = key === "tags" ? "tags" : key === "dietary" ? "dietary" : "products";
                const currentValue = prev[key];
                normalized[key] = normalizeMultiple(currentValue as string[], options[optionsKey as keyof typeof options] as string[]);
            });

            const isDifferent = multipleKeys.some(key => !isEqual(normalized[key], prev[key]));

            if (isDifferent) {
                debouncedApplyFilters(normalized);
                return normalized;
            }
            return prev;
        });
    }, [options, debouncedApplyFilters]);

    const apply = useCallback(() => {
        flushApplyFilters(); // Immediately flush any pending debounced call
        const result = FilterSchema.safeParse(filters);
        if (!result.success) {
            const newErrors: Record<keyof FilterState, string> = { ...EMPTY_ERRORS };
            result.error.errors.forEach(err => {
                const key = err.path[0];
                if (typeof key === "string") newErrors[key as keyof FilterState] = err.message;
            });
            setErrors(newErrors);
            return false;
        }

        setErrors(EMPTY_ERRORS);
        onFiltersChange(result.data);
        return true;
    }, [filters, flushApplyFilters, onFiltersChange]);

    const clear = useCallback(() => {
        setFilters(initialFilters);
        setErrors(EMPTY_ERRORS);
        onFiltersChange(initialFilters);
    }, [onFiltersChange]);

    return { filters, errors, handleChange, clear, apply };
};
