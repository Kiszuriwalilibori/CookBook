import { groq } from "next-sanity";
import type { Recipe } from "./types";
import { client } from "./createClient";


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