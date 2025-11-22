// lib/searchRecipeByTitle.ts
import { groq } from "next-sanity";
import { client } from "./createClient";

export async function searchRecipeByTitle(title: string) {
    console.log("title", title);
    const slug = await client.fetch(
        groq`*[_type == "recipe" && lower(title) == lower($title)][0] {
      "slug": slug.current
    }`,
        { title: title.trim() }
    );

    return slug?.slug || null;
}
