import { groq } from "next-sanity";
import { client } from "./client";
import { REGULAR_USER_STATUSES } from "@/types";

export type MinimalRecipe = {
    _id: string;
    slug?: string | null;
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
 *  - posiada slug.current (wymagane)
 *  - imageUrl pobierane WYŁĄCZNIE z description.image.asset->url
 *
 * Preferuje przepisy z description.image, ale dopełnia listę innymi przepisami jeśli potrzeba.
 */
export async function getRandomRecipes(count = 5): Promise<MinimalRecipe[]> {
    try {
        const statuses = REGULAR_USER_STATUSES.map(s => String(s).toLowerCase());

        const query = groq`
      *[
        _type == "recipe"
        && defined(slug.current)
        && lower(status) in $statuses
      ]{
        _id,
        "slug": slug.current,
        "imageUrl": description.image.asset->url,
        "title": title
      }
    `;

        const all = await client.fetch<MinimalRecipe[]>(query, { statuses });

        if (!Array.isArray(all) || all.length === 0) return [];

        // Preferuj te z imageUrl
        const withImage = all.filter(r => r.imageUrl && typeof r.imageUrl === "string");
        const withoutImage = all.filter(r => !r.imageUrl);

        const shuffledWithImage = shuffle(withImage);
        const shuffledWithoutImage = shuffle(withoutImage);

        const result: MinimalRecipe[] = [];
        for (const item of shuffledWithImage) {
            if (result.length >= count) break;
            result.push(item);
        }
        for (const item of shuffledWithoutImage) {
            if (result.length >= count) break;
            result.push(item);
        }

        return result;
    } catch (err) {
        console.error("[getRandomRecipes] error:", err);
        return [];
    }
}

export default getRandomRecipes;
