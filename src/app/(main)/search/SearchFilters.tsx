// // "use client";

// import { RecipeFilters } from "@/components";
// import { RecipeFilter } from "@/types";

// interface SearchFiltersProps {
//     options: RecipeFilter;
// }

// export default function SearchFilters({ options }: SearchFiltersProps) {
//     return <RecipeFilters options={options} />;
// }

"use client";

import { useEffect, useState } from "react";
import { RecipeFilters } from "@/components";
import { initialFilters } from "@/hooks/useFilters";
import { FilterState } from "@/models/filters";
import { RecipeFilter } from "@/types";

const STORAGE_KEY = "recipe-search-filters";

interface SearchFiltersProps {
    options: RecipeFilter;
}

export default function SearchFilters({ options }: SearchFiltersProps) {
    const [initialValues, setInitialValues] = useState<FilterState>(initialFilters);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            const savedFilters = localStorage.getItem(STORAGE_KEY);

            if (savedFilters) {
                const parsed: unknown = JSON.parse(savedFilters);
                if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                    setInitialValues({
                        ...initialFilters,
                        ...(parsed as Partial<FilterState>),
                    });
                }
            }
        } catch {
            // Ignorujemy nieprawidłowy zapis.
        }

        setReady(true);
    }, []);

    const handleFiltersChange = (filters: FilterState) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
        } catch {
            // Brak możliwości zapisania filtrów nie blokuje wyszukiwania.
        }
    };

    if (!ready) return null;

    return <RecipeFilters options={options} initialValues={initialValues} onFiltersChange={handleFiltersChange} />;
}
