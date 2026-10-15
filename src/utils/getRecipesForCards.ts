import { groq } from "next-sanity";
import { Recipe, REGULAR_USER_STATUSES } from "@/types";
import { client } from "./client";
import { buildFilterClause } from "./buildFilterClause";
import { FilterState } from "@/models/filters";
import { recipeCardProjection } from "@/utils/projections/recipeCardProjection";

export async function getRecipesForCards(filters?: Partial<FilterState>, isAdmin?: boolean): Promise<Recipe[]> {
    const appliedFilters: Partial<FilterState> = { ...filters };

    if (!isAdmin) {
        if (!appliedFilters.status || appliedFilters.status.length === 0) {
            appliedFilters.status = [...REGULAR_USER_STATUSES];
        }
    }

    const { clause, params } = buildFilterClause(appliedFilters);

    const query = groq`
        *[_type == "recipe"${clause}]{
            ${recipeCardProjection}
        } | order(_createdAt desc)
    `;

    try {
        return await client.fetch<Recipe[]>(query, params);
    } catch (err) {
        console.error("[SSR] fetch error:", err);
        throw err;
    }
}
