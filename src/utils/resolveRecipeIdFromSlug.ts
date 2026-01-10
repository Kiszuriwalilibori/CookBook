import { groq } from "next-sanity";
import { client } from "./client";

export async function resolveRecipeIdFromSlug(slug: string): Promise<string | null> {
    return client.fetch(
        groq`
      *[
        _type == "recipe" &&
        ($slug == slug.current || $slug in slug.history)
      ]
      | order(_updatedAt desc)
      [0]._id
    `,
        { slug }
    );
}
