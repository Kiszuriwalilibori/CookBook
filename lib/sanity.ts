// import { groq } from "next-sanity";
// import type { Recipe } from "./types";
// import { client } from "./createClient";

// export async function getRecipes(): Promise<Recipe[]> {
//     return client.fetch(
//         groq`*[_type == "recipe"]{
//       _id,
//       title,
//       slug,
//       description {
//         title,
//         content[],
//         image {
//           asset-> {
//             _id,
//             url
//           },
//           alt
//         },
//         notes
//       },
//       ingredients[] {
//         name,
//         quantity
//       },
//       Products,
//       preparationSteps[] {
//         title,
//         content[],
//         image {
//           asset-> {
//             _id,
//             url
//           },
//           alt
//         },
//         notes
//       },
//       calories,
//       preparationTime,
//       cookingTime,
//       servings,
//       cuisine,
//       dietaryRestrictions,
//       tags,
//       notes,
//       Kizia,
//       source
//     }`
//     );
// }

// Example: Add more modular functions here
// export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
//   return client.fetch(
//     groq`*[_type == "recipe" && slug.current == $slug][0]{
//       ... // Same projection as above
//     }`,
//     { slug }
//   );
// }

// export async function getRecipesForCards(): Promise<Recipe[]> {
//     return client.fetch(
//         groq`*[_type == "recipe"]{
//       _id,
//       title,
//       slug { current },
//       description {
//       title,
//         content[0] {
//           children[0] { text } // Simple first-text extraction for description preview
//         },
//         image {
//           asset-> {
//             url
//           },
//           alt
//         }
//       },
//       preparationTime,
//       servings,
//       difficulty
//     }`
//     );
// }

// export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
//     return client.fetch(
//         groq`*[_type == "recipe" && slug.current == $slug][0]{
//       _id,
//       title,
//       slug,
//       description {
//         title,
//         content[],
//         image {
//           asset-> {
//             _id,
//             url
//           },
//           alt
//         },
//         notes
//       },
//       ingredients[] {
//         name,
//         quantity
//       },
//       Products,
//       preparationSteps[] {
//         content[],
//         image {
//           asset-> {
//             _id,
//             url
//           },
//           alt
//         },
//         notes
//       },
//       calories,
//       preparationTime,
//       cookingTime,
//       servings,
//       cuisine,
//       difficulty,
//       dietaryRestrictions,
//       tags,
//       notes,
//       Kizia,
//       source
//     }`,
//         { slug } // Param for safe query
//     );
// }
