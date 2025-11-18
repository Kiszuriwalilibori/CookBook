// lib/getRecipesForCards.ts
import { groq } from "next-sanity";
import type { Recipe } from "./types";
import { client } from "./createClient";
import type { FilterState } from "@/types";

/**
 * Build a dynamic GROQ filter clause based on user filters.
 */
function buildFilterClause(filters?: Partial<FilterState>): string {
    if (!filters) return "";

    const conditions: string[] = [];

    if (filters.title) conditions.push(`title match "${filters.title}*"`);
    if (filters.cuisine) conditions.push(`cuisine == "${filters.cuisine}"`);
    if (filters.tag?.length) conditions.push(`count((tags[])[@ in ${JSON.stringify(filters.tag)}]) > 0`);
    if (filters.dietary?.length) conditions.push(`count((dietary[])[@ in ${JSON.stringify(filters.dietary)}]) > 0`);
    if (filters.product?.length) conditions.push(`count((products[])[@ in ${JSON.stringify(filters.product)}]) > 0`);
    
    return conditions.length ? ` && ${conditions.join(" && ")}` : "";
}

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
   
  } | order(_createdAt desc)`;

    return client.fetch(query);
}
