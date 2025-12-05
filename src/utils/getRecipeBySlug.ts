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
        quantity
      },
      products,
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
      dietary,
      tags,
      notes,
      Kizia,
      status,
      source
    }`,
        { slug } // Param for safe query
    );
}
