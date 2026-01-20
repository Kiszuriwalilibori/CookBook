import { headers } from "next/headers";
import { groq } from "next-sanity";

import type { Recipe } from "@/types";
import client from "./client";

export async function getFavoriteRecipesForSSR(): Promise<Recipe[]> {
    const h = await headers();

    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    if (!host) {
        console.error("No host header found");
        return [];
    }

    const url = `${protocol}://${host}/api/favorites/list`;

    const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
        headers: {
            cookie: h.get("cookie") ?? "",
        },
    });

    if (!res.ok) return [];

    const data: { recipe: { _id: string } }[] = await res.json();
    const ids = data.map(f => f.recipe._id);

    if (ids.length === 0) return [];

    const query = groq`*[_type == "recipe" && _id in $ids]{
        _id,
        title,
        slug { current },
        description {
          title,
          content[0] {
            children[0] { text }
          },
          image {
            asset-> { url },
            alt
          }
        },
        prepTime,
        cookTime,
        recipeYield,
        tags,
        dietary,
        products,
        kizia,
        status
    } | order(_createdAt desc)`;

    return client.fetch<Recipe[]>(query, { ids });
}
