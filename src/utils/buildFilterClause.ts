import { FilterState } from "@/models/filters";

export function buildFilterClause(filters?: Partial<FilterState>): string {
    if (!filters) return "";

    const conditions: string[] = [];

    // Pomocnicze normalizowanie
    const normalize = (value: string) => value.toLowerCase().trim();

    // 1. Status – specjalne traktowanie (tablica)
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
        const validStatuses = filters.status.map(s => normalize(s)).filter(s => ["good", "acceptable", "improvement", "forget"].includes(s));

        if (validStatuses.length > 0) {
            const quoted = validStatuses.map(s => `"${s}"`).join(", ");
            conditions.push(`lower(status) in [${quoted}]`);
        }
    }

    // 2. Pozostałe pola stringowe (bez status!)
    const stringFields = ["title", "source.url", "source.book", "source.title", "source.author", "source.where"] as const;

    stringFields.forEach(field => {
        const value = filters[field];
        if (typeof value !== "string" || !value.trim()) return;

        const normValue = normalize(value);
        if (field === "title") {
            conditions.push(`lower(${field}) match "${normValue}*"`);
        } else {
            conditions.push(`lower(${field}) == "${normValue}"`);
        }
    });

    // 3. Pola tablicowe (tags, cuisine, dietary, products)
    const arrayFields = ["cuisine", "tags", "dietary", "products"] as const;

    arrayFields.forEach(field => {
        const arr = filters[field];
        if (!Array.isArray(arr) || arr.length === 0) return;

        const normalized = arr.map(v => normalize(v));
        const quoted = normalized.map(v => `"${v}"`).join(", ");
        conditions.push(`count((${field}[])[@ in [${quoted}]]) > 0`);
    });

    // 4. Pola boolowskie
    if (filters.kizia === true) {
        conditions.push("kizia == true");
    }

    // Składamy całość
    return conditions.length ? ` && (${conditions.join(" && ")})` : "";
}
