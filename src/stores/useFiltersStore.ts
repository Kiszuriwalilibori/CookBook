import { create } from "zustand";
import { EMPTY_RECIPE_FILTER } from "@/types";
import { RecipeFilter } from "@/types";
import { initialFilters } from "@/hooks/useFilters";
import { FilterValuesTypes, FilterState } from "@/models/filters";

interface FilterStoreState {
    filters: FilterState;
    errors: Partial<Record<keyof FilterState, string>>;
    options: RecipeFilter;
}

interface FilterStoreActions {
    handleChange: (key: keyof FilterState, value: FilterValuesTypes) => void;
    clear: () => void;
    apply: () => boolean;
    setFilters: (filters: Partial<FilterState>) => void;
    initOptions: (options: RecipeFilter) => void;
}

type FilterStore = FilterStoreState & FilterStoreActions;

export const useFiltersStore = create<FilterStore>((set, get) => ({
    filters: initialFilters,
    errors: {},
    options: EMPTY_RECIPE_FILTER,

    handleChange: (key, value) => {
        const current = get();
        const newErrors = { ...current.errors };
        let error = "";

        // Simple validation examples
        if (typeof value === "string") {
            if (value.length > 50) error = "Maks. 50 znaków";
        } else if (Array.isArray(value) && value.length > 10) {
            error = "Maks. 10 elementów";
            value = value.slice(0, 10); // Truncate
        }

        if (error) {
            newErrors[key] = error;
        } else {
            delete newErrors[key];
        }

        set({ filters: { ...current.filters, [key]: value }, errors: newErrors });
    },

    clear: () => {
        set({ filters: initialFilters, errors: {} });
    },

    apply: () => {
        const { errors } = get();
        // Check for any errors
        const hasErrors = Object.values(errors).some(Boolean);
        if (hasErrors) return false;
        // Additional global validation if needed
        return true;
    },

    setFilters: (newFilters: Partial<FilterState>) => {
        const current = get();

        set({
            filters: { ...current.filters, ...newFilters },
            errors: {}, // Clear errors on set
        });
    },

    initOptions: (options: RecipeFilter) => {
        set({
            options: { ...EMPTY_RECIPE_FILTER, ...options }, // guarantees all keys exist
        });
    },
}));
