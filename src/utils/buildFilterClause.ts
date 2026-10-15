// import { FilterState } from "@/models/filters";

// export function buildFilterClause(filters?: Partial<FilterState>): string {
//     if (!filters) return "";

//     const conditions: string[] = [];

//     // Pomocnicze normalizowanie
//     const normalize = (value: string) => value.toLowerCase().trim();

//     // 1. Status – specjalne traktowanie (tablica)
//     if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
//         const validStatuses = filters.status.map(s => normalize(s)).filter(s => ["good", "acceptable", "improvement", "forget"].includes(s));

//         if (validStatuses.length > 0) {
//             const quoted = validStatuses.map(s => `"${s}"`).join(", ");
//             conditions.push(`lower(status) in [${quoted}]`);
//         }
//     }

//     // 2. Pozostałe pola stringowe (bez status!)
//     const stringFields = ["title", "source.url", "source.book", "source.title", "source.author", "source.where"] as const;

//     stringFields.forEach(field => {
//         const value = filters[field];
//         if (typeof value !== "string" || !value.trim()) return;

//         const normValue = normalize(value);
//         if (field === "title") {
//             conditions.push(`lower(${field}) match "${normValue}*"`);
//         } else {
//             conditions.push(`lower(${field}) == "${normValue}"`);
//         }
//     });

//     // 3. Pola tablicowe (tags, cuisine, dietary, products)
//     const arrayFields = ["cuisine", "tags", "dietary", "products"] as const;

//     arrayFields.forEach(field => {
//         const arr = filters[field];
//         if (!Array.isArray(arr) || arr.length === 0) return;

//         const normalized = arr.map(v => normalize(v));
//         const quoted = normalized.map(v => `"${v}"`).join(", ");
//         conditions.push(`count((${field}[])[@ in [${quoted}]]) > 0`);
//     });

//     // 4. Pola boolowskie
//     if (filters.kizia === true) {
//         conditions.push("kizia == true");
//     }

//     // Składamy całość
//     return conditions.length ? ` && (${conditions.join(" && ")})` : "";
// }

import { FilterState } from "@/models/filters";

export type FilterQueryParams = Record<string, string | string[]>;

export interface BuiltFilterClause {
    clause: string;
    params: FilterQueryParams;
}

const VALID_STATUSES = ["good", "acceptable", "improvement", "forget"] as const;

const STRING_FIELDS = [
    { field: "source.url", key: "source.url", param: "filter_source_url" },
    { field: "source.book", key: "source.book", param: "filter_source_book" },
    { field: "source.title", key: "source.title", param: "filter_source_title" },
    { field: "source.author", key: "source.author", param: "filter_source_author" },
    { field: "source.where", key: "source.where", param: "filter_source_where" },
] as const;

const ARRAY_FIELDS = [
    { field: "cuisine", param: "filter_cuisine" },
    { field: "tags", param: "filter_tags" },
    { field: "dietary", param: "filter_dietary" },
    { field: "products", param: "filter_products" },
] as const;

const normalize = (value: string): string => value.trim().toLowerCase();

export function buildFilterClause(filters?: Partial<FilterState>): BuiltFilterClause {
    if (!filters) {
        return { clause: "", params: {} };
    }

    const conditions: string[] = [];
    const params: FilterQueryParams = {};

    // Statusy: akceptujemy wyłącznie wartości ze stałej listy.
    if (Array.isArray(filters.status)) {
        const statuses = filters.status
            .filter(status => typeof status === "string")
            .map(normalize)
            .filter(status => (VALID_STATUSES as readonly string[]).includes(status));

        if (statuses.length > 0) {
            conditions.push("lower(status) in $filter_status");
            params.filter_status = statuses;
        }
    }

    // Tytuł: parametr zawiera wzorzec wyszukiwania, nie składnię GROQ.
    if (typeof filters.title === "string" && filters.title.trim()) {
        conditions.push("lower(title) match $filter_title");
        params.filter_title = `${normalize(filters.title)}*`;
    }

    // Nazwy pól pochodzą wyłącznie ze stałej listy powyżej.
    for (const { field, key, param } of STRING_FIELDS) {
        const value = filters[key];

        if (typeof value !== "string" || !value.trim()) {
            continue;
        }

        conditions.push(`lower(${field}) == $${param}`);
        params[param] = normalize(value);
    }

    // Wartości tablic są przekazywane jako parametry, nigdy jako literały GROQ.
    for (const { field, param } of ARRAY_FIELDS) {
        const value = filters[field];

        if (!Array.isArray(value)) {
            continue;
        }

        const normalized = value
            .filter((item): item is string => typeof item === "string")
            .map(normalize)
            .filter(Boolean);

        if (normalized.length === 0) {
            continue;
        }

        conditions.push(`count((${field}[])[@ in $${param}]) > 0`);
        params[param] = normalized;
    }

    if (filters.kizia === true) {
        conditions.push("kizia == true");
    }

    return {
        clause: conditions.length > 0 ? ` && (${conditions.join(" && ")})` : "",
        params,
    };
}
