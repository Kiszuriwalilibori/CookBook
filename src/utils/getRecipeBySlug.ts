import { groq } from "next-sanity";
import { client } from "./client";
import { Recipe } from "@/types";

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
        quantity,
        unit
      },
      products,
      ingredientsNotes,
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
      prepTime,
      cookTime,
      recipeYield,
      cuisine,
      dietary,
      tags,
      notes,
      kizia,
      status,
      source
    }`,
        { slug } // Param for safe query
    );
}
