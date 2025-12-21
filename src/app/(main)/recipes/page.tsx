import RecipesClient from "./RecipesClient";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { Status } from "@/types";
import { Recipe } from "@/types";
import { FilterState } from "@/models/filters";

interface RecipesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 3600;

// --- Helpers ---
const normalizeString = (val: unknown) => (typeof val === "string" ? val.toLowerCase() : undefined);
const normalizeArrayOrString = (val?: string | string[]) => (Array.isArray(val) ? val.map(v => v.toLowerCase()) : typeof val === "string" ? [val.toLowerCase()] : []);

const parseBoolean = (val?: string): boolean | undefined => (val === "true" ? true : undefined);

const VALID_STATUSES: Status[] = ["Good", "Acceptable", "Improvement", "Forget"];
// const parseStatus = (val?: string): Status | null => (val && VALID_STATUSES.includes(val as Status) ? (val as Status) : null);
const parseStatus = (val?: string): Status | undefined => (val && VALID_STATUSES.includes(val as Status) ? (val as Status) : undefined);
const SOURCE_KEYS: Array<keyof FilterState & string> = ["source.url", "source.book", "source.title", "source.author", "source.where"];

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
    const awaitedSearchParams = await searchParams;

    // Parse source fields
    const sourceFilters = Object.fromEntries(SOURCE_KEYS.map(key => [key, normalizeString(awaitedSearchParams[key])]));

    // Boolean and status safely handle array query params
    const kiziaValue = Array.isArray(awaitedSearchParams.kizia) ? parseBoolean(awaitedSearchParams.kizia[0]) : parseBoolean(awaitedSearchParams.kizia);

    const statusValue = Array.isArray(awaitedSearchParams.status) ? parseStatus(awaitedSearchParams.status[0]) : parseStatus(awaitedSearchParams.status);

    const filters: Partial<FilterState> = {
        title: normalizeString(awaitedSearchParams.title),
        cuisine: normalizeString(awaitedSearchParams.cuisine),
        tags: normalizeArrayOrString(awaitedSearchParams.tags),
        dietary: normalizeArrayOrString(awaitedSearchParams.dietary),
        products: normalizeArrayOrString(awaitedSearchParams.products),
        ...sourceFilters,
        kizia: kiziaValue,
        status: statusValue,
    };

    let initialRecipes: Recipe[] = [];
    try {
        initialRecipes = await getRecipesForCards(filters);
    } catch (error) {
        console.error("SSR fetch error:", error);
    }

    return <RecipesClient initialRecipes={initialRecipes} />;
}


// jest zwłoka w wyświetlaniu, na początku pokazuje że nie znaleziono przepisów, źle to wygląda
