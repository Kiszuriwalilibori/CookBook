import { initialFilters } from "@/hooks/useFilters";
import type { FilterState } from "@/models/filters";
import { Status } from "@/types";

const VALID_STATUSES = Object.values(Status) as string[];

export function parseFilterQuery(queryString: string): FilterState {
    const params = new URLSearchParams(queryString);

    const statuses = params.getAll("status").filter(value => VALID_STATUSES.includes(value)) as FilterState["status"];

    return {
        ...initialFilters,
        title: params.get("title") ?? "",
        cuisine: params.getAll("cuisine"),
        tags: params.getAll("tags"),
        dietary: params.getAll("dietary"),
        products: params.getAll("products"),
        status: statuses,
        kizia: params.get("kizia") === "true",
        "source.url": params.get("source.url") ?? "",
        "source.book": params.get("source.book") ?? "",
        "source.title": params.get("source.title") ?? "",
        "source.author": params.get("source.author") ?? "",
        "source.where": params.get("source.where") ?? "",
    };
}
