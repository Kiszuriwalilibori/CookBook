// lib/sanity.ts
// Sanity client and queries—imports env and types for modularity

import { createClient, groq } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "./env";
import type { Recipe } from "./types"; // Import types for return safety

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
});

export async function getRecipes(): Promise<Recipe[]> {
    return client.fetch(
        groq`*[_type == "recipe"]{
      _id,
      title,
      slug,
      description {
        title,
        content[],
        image {
          asset-> {
            _id,
            url
          },
          alt
        },
        notes
      },
      ingredients[] {
        name,
        quantity
      },
      Products,
      preparationSteps[] {
        title,
        content[],
        image {
          asset-> {
            _id,
            url
          },
          alt
        },
        notes
      },
      calories,
      preparationTime,
      cookingTime,
      servings,
      cuisine,
      dietaryRestrictions,
      tags,
      notes,
      Kizia,
      source
    }`
    );
}

// Example: Add more modular functions here
// export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
//   return client.fetch(
//     groq`*[_type == "recipe" && slug.current == $slug][0]{
//       ... // Same projection as above
//     }`,
//     { slug }
//   );
// }

export async function getRecipesForCards(): Promise<Recipe[]> {
    return client.fetch(
        groq`*[_type == "recipe"]{
      _id,
      title,
      slug { current },
      description {
      title,
        content[0] {
          children[0] { text } // Simple first-text extraction for description preview
        },
        image {
          asset-> {
            url
          },
          alt
        }
      },
      preparationTime,
      servings,
      difficulty
    }`
    );
}
