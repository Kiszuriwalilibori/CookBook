// lib/getRecipesForCards.ts
import { groq } from "next-sanity";
import type { Recipe } from "@/types";
import { client } from "./client";

import { buildFilterClause } from "./buildFilterClause";
import { FilterState } from "@/models/filters";

/**
 * Fetch recipes for cards — supports optional filters.
 */
export async function getRecipesForCards(filters?: Partial<FilterState>): Promise<Recipe[]> {
    const where = buildFilterClause(filters);

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
    preparationTime,
    cookingTime,
    recipeYield,
    tags,
    dietary,
    products,
    Kizia
  } | order(_createdAt desc)`;

    return client.fetch(query);
}
