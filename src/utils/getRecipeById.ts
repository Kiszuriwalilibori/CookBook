import { groq } from "next-sanity";
import { client } from "./client";
import { Recipe } from "@/types";

export async function getRecipeById(id: string): Promise<Recipe | null> {
    return client.fetch(
        groq`
      *[_type == "recipe" && _id == $id][0]{
        _id,
        title,
        slug,
        description {
          title,
          content[],
          image {
            asset->{ _id, url },
            alt
          },
          notes
        },
        ingredients[] {
          name,
          quantity,
          unit,
          excluded
        },
        ingredientsNotes,
        products,
        preparationSteps[] {
          content[],
          image {
            asset->{ _id, url },
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
        source,
        nutrition {
          per100g {
            calories,
            protein,
            fat,
            carbohydrate
          },
          totalWeight,
          calculatedAt
        }
      }
    `,
        { id }
    );
}
