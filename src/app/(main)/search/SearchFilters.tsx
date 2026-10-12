// "use client";

// import { RecipeFilters } from "@/components";
// import { RecipeFilter } from "@/types";

// interface SearchFiltersProps {
//     options: RecipeFilter;
// }

// export default function SearchFilters({ options }: SearchFiltersProps) {
//     return <RecipeFilters onFiltersChange={() => {}} options={options} />;
// }

"use client";

import { RecipeFilters } from "@/components";
import type { RecipeFilter } from "@/types";
import type { FilterState } from "@/models/filters";

interface SearchFiltersProps {
    options: RecipeFilter;
    initialValues?: FilterState;
}

export default function SearchFilters({ options, initialValues }: SearchFiltersProps) {
    return <RecipeFilters onFiltersChange={() => {}} options={options} initialValues={initialValues} />;
}
