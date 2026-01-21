import { groq } from "next-sanity";
import { Recipe, REGULAR_USER_STATUSES } from "@/types";
import { client } from "./client";
import { buildFilterClause } from "./buildFilterClause";
import { FilterState } from "@/models/filters";
import { recipeCardProjection } from "@/utils/projections/recipeCardProjection";

export async function getRecipesForCards(filters?: Partial<FilterState>, isAdmin?: boolean): Promise<Recipe[]> {
    // --- DEBUG log ---

    // --- Apply default status only for non-admin ---
    const appliedFilters: Partial<FilterState> = { ...filters };

    if (!isAdmin) {
        // jeśli non-admin i nie podano statusu, ustaw domyślnie Good i Acceptable
        if (!appliedFilters.status || appliedFilters.status.length === 0) {
            appliedFilters.status = [...REGULAR_USER_STATUSES];
        }
    }

    // --- Build GROQ where clause ---
    const where = buildFilterClause(appliedFilters);

    const query = groq`
  *[_type == "recipe"${where}]{
    ${recipeCardProjection}
  } | order(_createdAt desc)
`;
    try {
        const recipes = await client.fetch<Recipe[]>(query);
        return recipes;
    } catch (err) {
        console.error("[SSR] fetch error:", err);
        return [];
    }
}
