import { getRecipesForCards } from "@/lib/getRecipesForCards";
import RecipesClient from "./RecipesClient";
import { Status, type FilterState } from "@/types";
import { Recipe } from "@/lib/types";

interface RecipesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Explicitly type as Promise
}

export const revalidate = 3600;

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
    const awaitedSearchParams = await searchParams;

    const filters: Partial<FilterState> = {
        title: typeof awaitedSearchParams.title === "string" ? awaitedSearchParams.title.toLowerCase() : undefined,
        cuisine: typeof awaitedSearchParams.cuisine === "string" ? awaitedSearchParams.cuisine.toLowerCase() : undefined,

        tags: Array.isArray(awaitedSearchParams.tags) ? awaitedSearchParams.tags.map(t => t.toLowerCase()) : awaitedSearchParams.tags ? [awaitedSearchParams.tags.toLowerCase()] : [],

        dietary: Array.isArray(awaitedSearchParams.dietary) ? awaitedSearchParams.dietary.map(d => d.toLowerCase()) : awaitedSearchParams.dietary ? [awaitedSearchParams.dietary.toLowerCase()] : [],

        products: Array.isArray(awaitedSearchParams.products) ? awaitedSearchParams.products.map(p => p.toLowerCase()) : awaitedSearchParams.products ? [awaitedSearchParams.products.toLowerCase()] : [],

        "source.http": typeof awaitedSearchParams["source.http"] === "string" ? awaitedSearchParams["source.http"].toLowerCase() : undefined,
        "source.book": typeof awaitedSearchParams["source.book"] === "string" ? awaitedSearchParams["source.book"].toLowerCase() : undefined,
        "source.title": typeof awaitedSearchParams["source.title"] === "string" ? awaitedSearchParams["source.title"].toLowerCase() : undefined,
        "source.author": typeof awaitedSearchParams["source.author"] === "string" ? awaitedSearchParams["source.author"].toLowerCase() : undefined,
        "source.where": typeof awaitedSearchParams["source.where"] === "string" ? awaitedSearchParams["source.where"].toLowerCase() : undefined,
        // Boolean field
        Kizia: awaitedSearchParams.Kizia === "true" ? true : undefined,
        status: typeof awaitedSearchParams.status === "string" && ["Good", "Acceptable", "Improvement", "Forget"].includes(awaitedSearchParams.status) ? (awaitedSearchParams.status as Status) : null,
    };

    // Fetch filtered recipes on server with params
    let initialRecipes: Recipe[] = [];
    try {
        initialRecipes = await getRecipesForCards(filters);
        console.log("initialRecipes", initialRecipes);
    } catch (error) {
        console.error("SSR fetch error:", error);
    }

    return <RecipesClient initialRecipes={initialRecipes} />;
}
