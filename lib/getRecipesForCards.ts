
// lib/getRecipesForCards.ts
import { groq } from "next-sanity";
import type { Recipe } from "./types";
import { client } from "./createClient";
import type { FilterState } from "@/types";
import { buildFilterClause } from "./buildFilterClause";


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
    servings,
    tags,
    dietary,
    products,
    Kizia
  } | order(_createdAt desc)`;

    return client.fetch(query);
}
