import { Status, type Recipe } from "@/types";
import client from "./client";

export default async function getTopRatedRecipes(limit = 6): Promise<Recipe[]> {
    // 🔥 Pobieramy WIĘCEJ niż potrzebujemy (buffer)
    const bufferSize = limit * 3;

    const recipes: Recipe[] = await client.fetch(
        `
        *[
            _type == "recipe" &&
            defined(description.image.asset->url) &&
            defined(ratingSummary.average)
        ]
        | order(ratingSummary.average desc)[0...$buffer]
        {
            _id,
            title,
            slug,
            status,
            description {
                title,
                firstBlockText,
                image {
                    asset->{_id, url},
                    alt
                }
            },
            ratingSummary {
                average,
                count
            }
        }
        `,
        { buffer: bufferSize }
    );

    // 🔥 Filtr analogiczny do getLatestRecipes
    const filtered: Recipe[] = [];

    for (const r of recipes) {
        if (r.status === Status.Good || r.status === Status.Acceptable) {
            filtered.push(r);
        }

        if (filtered.length === limit) break;
    }

    return filtered;
}
