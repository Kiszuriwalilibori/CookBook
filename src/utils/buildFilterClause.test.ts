import { buildFilterClause } from "./buildFilterClause";
import { FilterState } from "@/models/filters";

// Example values for each field
const exampleValues: Partial<FilterState> = {
    title: "  Pizza  ",
    cuisine: "iTAlian",
    "source.http": "EXAMPLE.com",
    "source.book": "Cookbook",
    "source.title": "SourceTitle",
    "source.author": "AuthorName",
    "source.where": "Library",
    Kizia: true,
    tags: ["Vegan", "Quick"],
    dietary: ["Gluten-Free"],
    products: ["Tomato", "Cheese"],
};

// Normalization functions
const normalizeString = (value: string) => value.toLowerCase();
const normalizeArray = (arr?: string[]) => arr?.map(v => v.toLowerCase()) || [];

// Type-safe normalization helper
function normalizeField<K extends keyof FilterState>(key: K, value: FilterState[K]): FilterState[K] {
    if (typeof value === "string") return normalizeString(value) as FilterState[K];
    if (Array.isArray(value)) return normalizeArray(value) as FilterState[K];
    return value;
}

// Type-safe setter allowing undefined
function setFilterField<K extends keyof FilterState>(filter: Partial<FilterState>, key: K, value: FilterState[K] | undefined) {
    filter[key] = value;
}

// Group fields by type
const stringFields: (keyof FilterState)[] = ["title", "cuisine", "source.http", "source.book", "source.title", "source.author", "source.where", "status"];
const booleanFields: (keyof FilterState)[] = ["Kizia"];
const arrayFields: (keyof FilterState)[] = ["tags", "dietary", "products"];

// Helper: generate subsets (up to 2 items)
function pickSubsets<T>(arr: T[], maxSize = 2): T[][] {
    const subsets: T[][] = [];
    const n = arr.length;
    for (let size = 1; size <= Math.min(maxSize, n); size++) {
        const combine = (start: number, current: T[]) => {
            if (current.length === size) {
                subsets.push([...current]);
                return;
            }
            for (let i = start; i < n; i++) {
                current.push(arr[i]);
                combine(i + 1, current);
                current.pop();
            }
        };
        combine(0, []);
    }
    return subsets;
}

describe("buildFilterClause - fully type-safe combinatorial tests", () => {
    // Single-field tests
    [...stringFields, ...booleanFields, ...arrayFields].forEach(field => {
        it(`handles single field: ${field}`, () => {
            const filter: Partial<FilterState> = {};
            setFilterField(filter, field, normalizeField(field, exampleValues[field]!));
            expect(buildFilterClause(filter)).toMatchSnapshot();
        });
    });

    // Subsets of string fields
    pickSubsets(stringFields, 2).forEach(combo => {
        it(`handles string combination: ${combo.join(", ")}`, () => {
            const filter: Partial<FilterState> = {};
            combo.forEach(f => setFilterField(filter, f, normalizeField(f, exampleValues[f]!)));
            expect(buildFilterClause(filter)).toMatchSnapshot();
        });
    });

    // Subsets of array fields
    pickSubsets(arrayFields, 2).forEach(combo => {
        it(`handles array combination: ${combo.join(", ")}`, () => {
            const filter: Partial<FilterState> = {};
            combo.forEach(f => setFilterField(filter, f, normalizeField(f, exampleValues[f]!)));
            expect(buildFilterClause(filter)).toMatchSnapshot();
        });
    });

    // Mixed: string + boolean + array
    stringFields.forEach(s => {
        booleanFields.forEach(b => {
            arrayFields.forEach(a => {
                it(`handles combination: ${s} + ${b} + ${a}`, () => {
                    const filter: Partial<FilterState> = {};
                    setFilterField(filter, s, normalizeField(s, exampleValues[s]!));
                    setFilterField(filter, b, exampleValues[b]!);
                    setFilterField(filter, a, normalizeField(a, exampleValues[a]!));
                    expect(buildFilterClause(filter)).toMatchSnapshot();
                });
            });
        });
    });

    // All fields together
    it("handles all fields combined", () => {
        const filter: Partial<FilterState> = {};
        [...stringFields, ...arrayFields].forEach(f => setFilterField(filter, f, normalizeField(f, exampleValues[f]!)));
        booleanFields.forEach(f => setFilterField(filter, f, exampleValues[f]!));
        expect(buildFilterClause(filter)).toMatchSnapshot();
    });

    // Edge cases
    it("returns empty string for empty object", () => {
        expect(buildFilterClause({})).toBe("");
    });

    it("ignores undefined values", () => {
        const filter: Partial<FilterState> = {};
        [...stringFields, ...booleanFields, ...arrayFields].forEach(f => setFilterField(filter, f, undefined));
        expect(buildFilterClause(filter)).toBe("");
    });

    it("returns empty string for empty arrays", () => {
        expect(buildFilterClause({ tags: [], dietary: [], products: [] })).toBe("");
    });
});
