import RecipesClient from "./RecipesClient";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { Status, type Recipe } from "@/types";
import { FilterState } from "@/models/filters";

// ⬇️ SSR favorites
import { getUserFromCookies, getUserFavorites } from "@/utils";

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

    // --- Source filters ---
    const sourceFilters = Object.fromEntries(SOURCE_KEYS.map(key => [key, normalizeString(awaitedSearchParams[key])]));

    // --- Other filters ---
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

    // --- SSR recipes ---
    let initialRecipes: Recipe[] = [];
    try {
        const user = await getUserFromCookies();
        const isAdmin = Boolean(user?.isAdmin);
        console.log("isAdmin", isAdmin);
        initialRecipes = await getRecipesForCards(filters, isAdmin);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }

    // --- SSR favorites (NO CACHE, per-request) ---
    let initialFavorites: string[] = [];
    try {
        const user = await getUserFromCookies();
        if (user) {
            const favorites = await getUserFavorites(user.userId);
            initialFavorites = favorites.map(f => f._id);
        }
    } catch (err) {
        console.error("Error fetching favorites:", err);
    }

    return <RecipesClient initialRecipes={initialRecipes} initialFavorites={initialFavorites} />;
}
