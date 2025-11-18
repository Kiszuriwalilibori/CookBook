// lib/searchRecipeByTitle.ts
import { groq } from "next-sanity";
import { client } from "./createClient";

export async function searchRecipeByTitle(title: string) {
    const slug = await client.fetch(
        groq`*[_type == "recipe" && title == $title][0] {
      "slug": slug.current
    }`,
        { title: title.trim() }
    );

    return slug?.slug || null;
}
