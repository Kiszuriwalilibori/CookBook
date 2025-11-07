import { groq } from "next-sanity";
import type { Recipe } from "./types";
import { client } from "./createClient";

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
    return client.fetch(
        groq`*[_type == "recipe" && slug.current == $slug][0]{
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
    }`,
        { slug } // Param for safe query
    );
}
