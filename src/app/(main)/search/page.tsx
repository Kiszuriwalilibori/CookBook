import { fetchSummary } from "@/utils/fetchSummary";

import SearchFilters from "./SearchFilters";

export default async function SearchPage() {
    const { summary } = await fetchSummary();

    if (!summary) {
        return null;
    }

    return <SearchFilters options={summary} />;
}
