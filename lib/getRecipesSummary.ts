import { client } from "./createClient";
import { groq } from "next-sanity";
import type { Options } from "@/types";

export async function getRecipesSummary(): Promise<Options> {
    const rawData = await client.fetch(groq`{
    "titles": array::unique(*[_type == "recipe"].title),
    "cuisines": array::unique(*[_type == "recipe"].cuisine),
    "tags": array::unique(*[_type == "recipe" && defined(tags)] .tags[]),
    "_dietaryRestrictionsRaw": array::unique(*[_type == "recipe" && defined(dietaryRestrictions)] .dietaryRestrictions[]),
    "products": array::unique(*[_type == "recipe" && defined(products)] .products[]),
  }`);

    // Function to normalize and deduplicate items
    const normalizeItems = (items: string[]): string[] => {
        return items
            .map(item => item.toLowerCase()) // Normalize to lowercase
            .filter((value, index, self) => self.indexOf(value) === index); // Deduplicate
    };

    const normalizedDietary = normalizeItems(rawData._dietaryRestrictionsRaw);
    const normalizedTitles = normalizeItems(rawData.titles);
    const normalizedCuisines = normalizeItems(rawData.cuisines);
    const normalizedTags = normalizeItems(rawData.tags);
    const normalizedProducts = normalizeItems(rawData.products);

    // Clean up and return the final result
    const { _dietaryRestrictionsRaw, ...cleanData } = rawData;

    return {
        ...cleanData,
        dietaryRestrictions: normalizedDietary,
        titles: normalizedTitles,
        cuisines: normalizedCuisines,
        tags: normalizedTags,
        products: normalizedProducts,
    };
}

// todo sprawdzić czy nadal gdzieś w recipes jest Wegetariańska z dużej litery, i czy to przechodzi do sanity Summary. Jeżeli tak to zmodyfikować agregację
