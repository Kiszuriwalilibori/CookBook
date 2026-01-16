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

const VALID_STATUSES: readonly Status[] = [Status.Good, Status.Acceptable, Status.Improvement, Status.Forget];
const parseStatuses = (val?: string | string[]): Status[] | undefined => {
    if (!val) return undefined;
    const values = Array.isArray(val) ? val : [val];
    const parsed = values.map(v => v as Status).filter(v => VALID_STATUSES.includes(v));
    return parsed.length > 0 ? parsed : undefined;
};

const SOURCE_KEYS: Array<keyof FilterState & string> = ["source.url", "source.book", "source.title", "source.author", "source.where"];

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
    const awaitedSearchParams = await searchParams;

    // Parse source fields
    const sourceFilters = Object.fromEntries(SOURCE_KEYS.map(key => [key, normalizeString(awaitedSearchParams[key])]));

    // Boolean and status safely handle array query params
    const kiziaValue = Array.isArray(awaitedSearchParams.kizia) ? parseBoolean(awaitedSearchParams.kizia[0]) : parseBoolean(awaitedSearchParams.kizia);

    const statusValue = parseStatuses(awaitedSearchParams.status);

    const filters: Partial<FilterState> = {
        title: normalizeString(awaitedSearchParams.title),
        cuisine: normalizeArrayOrString(awaitedSearchParams.cuisine),
        tags: normalizeArrayOrString(awaitedSearchParams.tags),
        dietary: normalizeArrayOrString(awaitedSearchParams.dietary),
        products: normalizeArrayOrString(awaitedSearchParams.products),
        ...sourceFilters,
        kizia: kiziaValue,
        status: statusValue,
    };

    let initialRecipes: Recipe[] = [];
    try {
        initialRecipes = await getRecipesForCards(filters, false);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }

    return <RecipesClient initialRecipes={initialRecipes} />;
}

// jest zwłoka w wyświetlaniu, na początku pokazuje że nie znaleziono przepisów, źle to wygląda

// TODO: ma zastrzeżenia co do typów tutaj, później się temu przyjrzeć
//
// const VALID_STATUSES: readonly Status[] = [Status.Good, Status.Acceptable, Status.Improvement, Status.Forget];
// const parseStatuses = (val?: string | string[]): Status[] | undefined => {
//     if (!val) return undefined;
//     const values = Array.isArray(val) ? val : [val];
//     const parsed = values.map(v => v as Status).filter(v => VALID_STATUSES.includes(v));
//     return parsed.length > 0 ? parsed : undefined;
// };
