import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useDebouncedCallback } from "./useDebouncedCallback";
import { normalizeMultiple } from "@/components/RecipeFilters/utils/normalize";
import { Options } from "@/types";

// Constants (extracted for magic numbers)
const MAX_TAGS = 10;

// Define empty errors object with all keys
const EMPTY_ERRORS: Record<keyof FilterState, string> = {
    title: "",
    cuisine: "",
    tag: "",
    dietary: "",
    product: "",
};

const FilterSchema = z.object({
    title: z.string().default(""),
    cuisine: z.string().default(""),
    tag: z.array(z.string()).max(MAX_TAGS, `Maksymalnie ${MAX_TAGS} tagów`),
    dietary: z.array(z.string()),
    product: z.array(z.string()),
});

export type FilterState = z.infer<typeof FilterSchema>;

export const useFilters = (options: Options, onFiltersChange: (filters: FilterState) => void) => {
    const [filters, setFilters] = useState<FilterState>({
        title: "",
        cuisine: "",
        tag: [],
        dietary: [],
        product: [],
    });

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

                if (Array.isArray(value)) {
                    // multi-value case
                    let normalized: string[];
                    if (key === "tag") {
                        normalized = normalizeMultiple(value, options.tags);
                        updated.tag = normalized;
                    } else if (key === "dietary") {
                        normalized = normalizeMultiple(value, options.dietaryRestrictions);
                        updated.dietary = normalized;
                    } else if (key === "product") {
                        normalized = normalizeMultiple(value, options.products);
                        updated.product = normalized;
                    }
                } else {
                    // single-value case
                    const normalized = (value as string).trim().toLowerCase();
                    if (key === "title") updated.title = normalized;
                    if (key === "cuisine") updated.cuisine = normalized;
                }

                debouncedApplyFilters(updated);
                return updated;
            });
        },
        [options, debouncedApplyFilters]
    );

    useEffect(() => {
        if (options.tags.length === 0) return; // Skip if options not loaded yet

        setFilters(prev => {
            const normalized = { ...prev };
            const multipleKeys: ("tag" | "dietary" | "product")[] = ["tag", "dietary", "product"];
            multipleKeys.forEach(key => {
                const optionsKey = key === "tag" ? "tags" : key === "dietary" ? "dietaryRestrictions" : "products";
                const currentValue = prev[key];
                normalized[key] = normalizeMultiple(currentValue as string[], options[optionsKey as keyof typeof options] as string[]);
            });

            // Avoid JSON.stringify for performance; compare arrays directly
            let isDifferent = false;
            multipleKeys.forEach(key => {
                if (normalized[key].join(",") !== prev[key].join(",")) {
                    isDifferent = true;
                }
            });

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
        const cleared: FilterState = {
            title: "",
            cuisine: "",
            tag: [],
            dietary: [],
            product: [],
        };
        setFilters(cleared);
        setErrors(EMPTY_ERRORS);
        onFiltersChange(cleared);
    }, [onFiltersChange]);

    return { filters, errors, handleChange, clear, apply };
};
