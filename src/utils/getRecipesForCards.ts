import { groq } from "next-sanity";
import type { Recipe, Status } from "@/types";
import { client } from "./client";
import { buildFilterClause } from "./buildFilterClause";
import { FilterState } from "@/models/filters";

export async function getRecipesForCards(
    filters?: Partial<FilterState>,
    isAdmin?: boolean
): Promise<Recipe[]> {
    // --- DEBUG log ---
    console.log("[SSR] incoming filters:", filters);
    console.log("[SSR] isAdmin:", isAdmin);

    // --- Apply default status only for non-admin ---
    const appliedFilters: Partial<FilterState> = { ...filters };

    if (!isAdmin) {
        // jeśli non-admin i nie podano statusu, ustaw domyślnie Good i Acceptable
        if (!appliedFilters.status || appliedFilters.status.length === 0) {
            appliedFilters.status = ["Good", "Acceptable"] as Status[];
        }
    }

    // --- Build GROQ where clause ---
    const where = buildFilterClause(appliedFilters);

    console.log("[SSR] appliedFilters for query:", appliedFilters);
    console.log("[SSR] GROQ where clause:", where);

    const query = groq`*[_type == "recipe"${where}]{
        _id,
        title,
        slug { current },
        description {
          title,
          content[0] {
            children[0] { text }
          },
          image {
            asset-> { url },
            alt
          }
        },
        prepTime,
        cookTime,
        recipeYield,
        tags,
        dietary,
        products,
        kizia,
        status
    } | order(_createdAt desc)`;

    try {
        const recipes = await client.fetch<Recipe[]>(query);
        console.log("[SSR] fetched recipes count:", recipes.length);
        return recipes;
    } catch (err) {
        console.error("[SSR] fetch error:", err);
        return [];
    }
}
