"use client";

import { RecipeFilters } from "@/components";
import { RecipeFilter } from "@/types";

interface SearchFiltersProps {
    options: RecipeFilter;
}

export default function SearchFilters({ options }: SearchFiltersProps) {
    return <RecipeFilters onFiltersChange={() => {}} options={options} />;
}
