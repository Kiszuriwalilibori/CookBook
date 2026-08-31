import { groq } from "next-sanity";
import { client } from "./client";
import { REGULAR_USER_STATUSES } from "@/types";
import { ApiResponse } from "@/models/apiResponse";
import { urlFor } from "../lib/sanity/imageUrl";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export type MinimalRecipe = {
    _id: string;
    slug?: string | null;
    image?: SanityImageSource | null;
    imageUrl?: string | null;
    title?: string | null;
};

function shuffle<T>(arr: T[]) {
    const a = arr.slice();

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

/**
 * Pobiera `count` losowych przepisów:
 *  - status ∈ REGULAR_USER_STATUSES
 *  - posiada slug.current
 *  - posiada description.image.asset
 *  - zwraca gotowy imageUrl dla karuzeli
 */
export async function getRandomRecipes(count = 5): Promise<ApiResponse<MinimalRecipe[]>> {
    try {
        const statuses = REGULAR_USER_STATUSES.map(s => String(s).toLowerCase());

        const query = groq`
            *[
                _type == "recipe"
                && defined(slug.current)
                && lower(status) in $statuses
                && defined(description.image.asset)
            ]{
                _id,
                "slug": slug.current,
                "image": description.image,
                title
            }
        `;

        const all = await client.fetch<MinimalRecipe[]>(query, { statuses });

        if (!Array.isArray(all)) {
            return {
                ok: false,
                error: {
                    code: "INVALID_RESPONSE",
                    message: "Nieprawidłowa odpowiedź serwera",
                },
            };
        }

        if (all.length === 0) {
            return {
                ok: true,
                data: [],
            };
        }

        const result = shuffle(all)
            .slice(0, count)
            .map(recipe => ({
                _id: recipe._id,
                slug: recipe.slug,
                title: recipe.title,
                imageUrl: recipe.image ? urlFor(recipe.image).width(640).height(400).quality(75).auto("format").url() : null,
            }));

        return {
            ok: true,
            data: result,
        };
    } catch (err) {
        console.error("[getRandomRecipes] error:", err);

        return {
            ok: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Nie udało się pobrać losowych przepisów",
            },
        };
    }
}

export default getRandomRecipes;
