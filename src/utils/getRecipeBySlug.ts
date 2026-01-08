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
        unit,
        excluded
      },
      ingredientsNotes,
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
      // Stare pole – zostaje na razie
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
      
      // NOWE: wartości odżywcze na 100 g + całkowita waga
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
    }`,
        { slug }
    );
}

//todo tak naprawdę to powinien brać po id (_id)
