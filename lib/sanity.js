import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-10-09',
  useCdn: true,
});

export async function getRecipes() {
  const recipes = await client.fetch('*[_type == "recipe"]');
  return recipes;
}