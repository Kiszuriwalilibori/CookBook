import { getRecipesForCards } from "@/lib/getRecipesForCards";
import RecipesClient from "./RecipesClient";
import { type FilterState } from "@/types";
import { Recipe } from "@/lib/types";

interface RecipesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Explicitly type as Promise
}

export const revalidate = 3600;

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
    
    const awaitedSearchParams = await searchParams;

    const filters: Partial<FilterState> = {
        title: typeof awaitedSearchParams.title === "string" ? awaitedSearchParams.title : undefined,
        cuisine: typeof awaitedSearchParams.cuisine === "string" ? awaitedSearchParams.cuisine : undefined,
        tag: Array.isArray(awaitedSearchParams.tag) ? awaitedSearchParams.tag : awaitedSearchParams.tag ? [awaitedSearchParams.tag] : [],
        dietary: Array.isArray(awaitedSearchParams.dietary) ? awaitedSearchParams.dietary : awaitedSearchParams.dietary ? [awaitedSearchParams.dietary] : [],
        product: Array.isArray(awaitedSearchParams.product) ? awaitedSearchParams.product : awaitedSearchParams.product ? [awaitedSearchParams.product] : [],
    };

    // Fetch filtered recipes on server with params
    let initialRecipes: Recipe[] = [];
    try {
        initialRecipes = await getRecipesForCards(filters);
    } catch (error) {
        console.error("SSR fetch error:", error);
        // Fallback to empty or all? For now, empty to avoid errors
    }

    return <RecipesClient initialRecipes={initialRecipes} />;
}
