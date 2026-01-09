import { groq } from "next-sanity";
import type { Recipe } from "@/types";
import { client } from "./client";
import { buildFilterClause } from "./buildFilterClause";
import { FilterState } from "@/models/filters";

const DEFAULT_STATUS_FILTER: FilterState["status"] = ["Good", "Acceptable"];

/**
 * Fetch recipes for cards — supports optional filters.
 * Always applies default status filter unless explicitly overridden.
 */
export async function getRecipesForCards(filters?: Partial<FilterState>): Promise<Recipe[]> {
    // Jeśli filters nie ma wcale LUB nie ma w nim klucza status → zastosuj domyślny
    const effectiveFilters: Partial<FilterState> = {
        ...filters,
        status: filters?.status ?? DEFAULT_STATUS_FILTER,
    };

    const where = buildFilterClause(effectiveFilters);

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

    return client.fetch(query);
}
