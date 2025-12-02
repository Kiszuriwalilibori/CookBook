import { FilterState } from "@/types"; // remove Status import

export function buildFilterClause(filters?: Partial<FilterState>): string {
    if (!filters) return "";

    const conditions: string[] = [];
    const normalize = (value: string) => value.toLowerCase();

    // ---------------- Helper types ----------------
    type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];
    type BooleanKeys<T> = { [K in keyof T]: T[K] extends boolean ? K : never }[keyof T];
    type ArrayKeys<T> = { [K in keyof T]: T[K] extends string[] ? K : never }[keyof T];

    // Extract keys automatically from filters
    const stringFields = Object.keys(filters).filter((k): k is StringKeys<FilterState> => typeof filters[k as keyof FilterState] === "string");

    const booleanFields = Object.keys(filters).filter((k): k is BooleanKeys<FilterState> => typeof filters[k as keyof FilterState] === "boolean");

    const arrayFields = Object.keys(filters).filter((k): k is ArrayKeys<FilterState> => Array.isArray(filters[k as keyof FilterState]) && (filters[k as keyof FilterState] as unknown[]).every(v => typeof v === "string"));

    // ---------------- Helper functions ----------------
    function processStringField(filters: Partial<FilterState>, field: StringKeys<FilterState>) {
        const value = filters[field];
        if (!value) return;

        // handle status by name without TypeScript complaining
        if (field === ("status" as StringKeys<FilterState>)) {
            conditions.push(`lower(${field}) == "${normalize(value)}"`);
            return;
        }

        const op = field === "title" ? "match" : "==";
        const condition = op === "match" ? `lower(${field}) match "${normalize(value)}*"` : `lower(${field}) == "${normalize(value)}"`;
        conditions.push(condition);
    }

    function processBooleanField(filters: Partial<FilterState>, field: BooleanKeys<FilterState>) {
        if (filters[field] === true) {
            conditions.push(`${field} == true`);
        }
    }

    function processArrayField(filters: Partial<FilterState>, field: ArrayKeys<FilterState>) {
        const arr = ((filters[field] ?? []) as string[]).map(v => v.toLowerCase());
        if (arr.length) {
            conditions.push(`count((${field}[])[@ in ${JSON.stringify(arr)}]) > 0`);
        }
    }

    // ---------------- Process each field type ----------------
    stringFields.forEach(f => processStringField(filters, f));
    booleanFields.forEach(f => processBooleanField(filters, f));
    arrayFields.forEach(f => processArrayField(filters, f));

    return conditions.length ? ` && (${conditions.join(" && ")})` : "";
}
