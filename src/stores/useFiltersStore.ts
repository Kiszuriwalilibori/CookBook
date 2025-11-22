import { create } from "zustand";
import { type FilterState } from "@/types";
import { RecipeFilter } from "@/types";

const DEFAULT_FILTERS: FilterState = {
    title: "",
    cuisine: "",
    tags: [],
    dietary: [],
    products: [],
};

interface FilterStoreState {
    filters: FilterState;
    errors: Partial<Record<keyof FilterState, string>>;
    options: RecipeFilter;
}

interface FilterStoreActions {
    handleChange: (key: keyof FilterState, value: string | string[]) => void;
    clear: () => void;
    apply: () => boolean;
    setFilters: (filters: Partial<FilterState>) => void;
    initOptions: (options: RecipeFilter) => void;
}

type FilterStore = FilterStoreState & FilterStoreActions;

export const useFiltersStore = create<FilterStore>((set, get) => ({
    filters: DEFAULT_FILTERS,
    errors: {},
    options: { title: [], cuisine: [], tags: [], dietary: [], products: [] }, // Empty default

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
        set({ filters: DEFAULT_FILTERS, errors: {} });
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
        const current = get();
        set({
            options,
            filters: { ...current.filters }, // Preserve filters, but could reset if needed
        });
    },
}));
