// import { fetchSummary } from "@/utils/fetchSummary";

// import SearchFilters from "./SearchFilters";

// export default async function SearchPage() {
//     const { summary } = await fetchSummary();

//     if (!summary) {
//         return null;
//     }

//     return <SearchFilters options={summary} />;
// }

import { cookies } from "next/headers";
import { fetchSummary } from "@/utils/fetchSummary";
import { FILTER_COOKIE_NAME } from "@/components/RecipeFilters/utils/filterPersistence";
import { parseFilterQuery } from "@/components/RecipeFilters/utils/parseFilterQuery";
import SearchFilters from "./SearchFilters";

export default async function SearchPage() {
    const { summary } = await fetchSummary();

    if (!summary) {
        return null;
    }

    const cookieStore = await cookies();
    const savedValue = cookieStore.get(FILTER_COOKIE_NAME)?.value;

    let initialValues = undefined;

    if (savedValue) {
        try {
            const queryString = decodeURIComponent(savedValue);

            if (queryString) {
                initialValues = parseFilterQuery(queryString);
            }
        } catch {
            // Niepoprawne ciasteczko ignorujemy.
        }
    }

    return <SearchFilters options={summary} initialValues={initialValues} />;
}
