import { groq } from "next-sanity";
import { Recipe, REGULAR_USER_STATUSES } from "@/types";
import { client } from "./client";
import { buildFilterClause } from "./buildFilterClause";
import { FilterState } from "@/models/filters";
import { recipeCardProjection } from "@/utils/projections/recipeCardProjection";

export async function getRecipesForCards(filters?: Partial<FilterState>, isAdmin?: boolean): Promise<Recipe[]> {
    const appliedFilters: Partial<FilterState> = { ...filters };

    if (!isAdmin) {
        appliedFilters.status = [...REGULAR_USER_STATUSES];
    }
    const { clause, params } = buildFilterClause(appliedFilters);

    const visibilityClause = isAdmin ? "" : " && defined(description.image.asset->url)";

    const query = groq`
    *[_type == "recipe"${clause}${visibilityClause}]{
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
