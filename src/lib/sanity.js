import { createClient } from "@sanity/client";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2025-10-09",
    useCdn: true,
});

export async function getRecipes() {
    const recipes = await client.fetch(`
    *[_type == "recipe"]{
      _id,
      title,
      slug,
      description,
      ingredients,
      Products,
      preparationSteps,
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
    }
  `);
    return recipes;
}

export async function getRecipeBySlug(slug) {
    const recipe = await client.fetch(
        `
    *[_type == "recipe" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      description,
      ingredients,
      Products,
      preparationSteps,
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
    }
  `,
        { slug }
    );
    return recipe;
}

export default client;
