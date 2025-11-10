import { client } from "./createClient";
import { groq } from "next-sanity";
import type { Options } from "@/types";

export async function getRecipesSummary(): Promise<Options> {
    return client.fetch(groq`{
    "titles": array::unique(*[_type == "recipe"].title),
    "cuisines": array::unique(*[_type == "recipe"].cuisine),
    "tags": array::unique(*[_type == "recipe"].tags[]),
    "dietaryRestrictions": array::unique(*[_type == "recipe"].dietaryRestrictions[]),
   "products": array::unique(*[_type == "recipe" && defined(products)][].products[defined(@) && @ != ""]),
  }`);
}
