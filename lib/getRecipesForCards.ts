// // lib/getRecipesForCards.ts
// import { groq } from "next-sanity";
// import type { Recipe } from "./types";
// import { client } from "./createClient";
// import type { FilterState } from "@/types";

// /**
//  * Build a dynamic GROQ filter clause based on user filters.
//  */
// function buildFilterClause(filters?: Partial<FilterState>): string {
//     if (!filters) return "";

//     const conditions: string[] = [];

//     if (filters.title) conditions.push(`title match "${filters.title}*"`);
//     if (filters.cuisine) conditions.push(`cuisine == "${filters.cuisine}"`);
//     if (filters.tags?.length) conditions.push(`count((tags[])[@ in ${JSON.stringify(filters.tags)}]) > 0`);
//     if (filters.dietary?.length) conditions.push(`count((dietary[])[@ in ${JSON.stringify(filters.dietary)}]) > 0`);
//     if (filters.products?.length) conditions.push(`count((products[])[@ in ${JSON.stringify(filters.products)}]) > 0`);
//     if (filters.Kizia === true) conditions.push(`Kizia == true`);
//     if (filters["source.http"]) conditions.push(`source.http == "${filters["source.http"]}"`);
//     if (filters["source.book"]) conditions.push(`source.book == "${filters["source.book"]}"`);
//     if (filters["source.title"]) conditions.push(`source.title == "${filters["source.title"]}"`);
//     if (filters["source.author"]) conditions.push(`source.author == "${filters["source.author"]}"`);
//     if (filters["source.where"]) conditions.push(`source.where == "${filters["source.where"]}"`);
//     // return conditions.length ? ` && ${conditions.join(" && ")}` : "";
//     return conditions.length ? ` && (${conditions.join(" && ")})` : "";
// }

// /**
//  * Fetch recipes for cards — supports optional filters.
//  */
// export async function getRecipesForCards(filters?: Partial<FilterState>): Promise<Recipe[]> {
//     const where = buildFilterClause(filters);

//     const query = groq`*[_type == "recipe"${where}]{
//     _id,
//     title,
//     slug { current },
//     description {
//       title,
//       content[0] {
//         children[0] { text }
//       },
//       image {
//         asset-> { url },
//         alt
//       }
//     },
//     preparationTime,
//     cookingTime,
//     servings,

//   } | order(_createdAt desc)`;

//     return client.fetch(query);
// }

// lib/getRecipesForCards.ts
import { groq } from "next-sanity";
import type { Recipe } from "./types";
import { client } from "./createClient";
import type { FilterState } from "@/types";

/**
 * Build a dynamic GROQ filter clause based on user filters.
 * Handles case-insensitive string comparisons and boolean fields.
 * Assumes arrays in Sanity (tags, dietary, products) are stored in lowercase.
 */
function buildFilterClause(filters?: Partial<FilterState>): string {
    if (!filters) return "";

    const conditions: string[] = [];

    const normalize = (value: string) => value.toLowerCase();

    // Single string fields → case-insensitive
    if (filters.title) conditions.push(`lower(title) match "${normalize(filters.title)}*"`);
    if (filters.cuisine) conditions.push(`lower(cuisine) == "${normalize(filters.cuisine)}"`);

    if (filters["source.http"]) conditions.push(`lower(source.http) == "${normalize(filters["source.http"])}"`);
    if (filters["source.book"]) conditions.push(`lower(source.book) == "${normalize(filters["source.book"])}"`);
    if (filters["source.title"]) conditions.push(`lower(source.title) == "${normalize(filters["source.title"])}"`);
    if (filters["source.author"]) conditions.push(`lower(source.author) == "${normalize(filters["source.author"])}"`);
    if (filters["source.where"]) conditions.push(`lower(source.where) == "${normalize(filters["source.where"])}"`);

    // Boolean field
    if (filters.Kizia === true) conditions.push(`Kizia == true`);

    // Array fields → assuming Sanity stores them in lowercase
    const processArray = (arr?: string[]) => arr?.map(item => item.toLowerCase()) || [];

    const tags = processArray(filters.tags);
    if (tags.length) conditions.push(`count((tags[])[@ in ${JSON.stringify(tags)}]) > 0`);

    const dietary = processArray(filters.dietary);
    if (dietary.length) conditions.push(`count((dietary[])[@ in ${JSON.stringify(dietary)}]) > 0`);

    const products = processArray(filters.products);
    if (products.length) conditions.push(`count((products[])[@ in ${JSON.stringify(products)}]) > 0`);

    return conditions.length ? ` && (${conditions.join(" && ")})` : "";
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
    tags,
    dietary,
    products,
    Kizia
  } | order(_createdAt desc)`;

    return client.fetch(query);
}
