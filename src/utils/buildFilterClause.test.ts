// import { buildFilterClause } from "./buildFilterClause";
// import { FilterState } from "@/models/filters";

// // Example values for each field
// const exampleValues: Partial<FilterState> = {
//     title: "  Pizza  ",
//     cuisine: "iTAlian",
//     "source.url": "EXAMPLE.com",
//     "source.book": "Cookbook",
//     "source.title": "SourceTitle",
//     "source.author": "AuthorName",
//     "source.where": "Library",
//     kizia: true,
//     tags: ["Vegan", "Quick"],
//     dietary: ["Gluten-Free"],
//     products: ["Tomato", "Cheese"],
// };

// // Normalization functions
// const normalizeString = (value: string) => value.toLowerCase();
// const normalizeArray = (arr?: string[]) => arr?.map(v => v.toLowerCase()) || [];

// // Type-safe normalization helper
// function normalizeField<K extends keyof FilterState>(key: K, value: FilterState[K]): FilterState[K] {
//     if (typeof value === "string") return normalizeString(value) as FilterState[K];
//     if (Array.isArray(value)) return normalizeArray(value) as FilterState[K];
//     return value;
// }

// // Type-safe setter allowing undefined
// function setFilterField<K extends keyof FilterState>(filter: Partial<FilterState>, key: K, value: FilterState[K] | undefined) {
//     filter[key] = value;
// }

// // Group fields by type
// const stringFields: (keyof FilterState)[] = ["title", "cuisine", "source.url", "source.book", "source.title", "source.author", "source.where", "status"];
// const booleanFields: (keyof FilterState)[] = ["kizia"];
// const arrayFields: (keyof FilterState)[] = ["tags", "dietary", "products"];

// // Helper: generate subsets (up to 2 items)
// function pickSubsets<T>(arr: T[], maxSize = 2): T[][] {
//     const subsets: T[][] = [];
//     const n = arr.length;
//     for (let size = 1; size <= Math.min(maxSize, n); size++) {
//         const combine = (start: number, current: T[]) => {
//             if (current.length === size) {
//                 subsets.push([...current]);
//                 return;
//             }
//             for (let i = start; i < n; i++) {
//                 current.push(arr[i]);
//                 combine(i + 1, current);
//                 current.pop();
//             }
//         };
//         combine(0, []);
//     }
//     return subsets;
// }

// describe("buildFilterClause - fully type-safe combinatorial tests", () => {
//     // Single-field tests
//     [...stringFields, ...booleanFields, ...arrayFields].forEach(field => {
//         it(`handles single field: ${field}`, () => {
//             const filter: Partial<FilterState> = {};
//             setFilterField(filter, field, normalizeField(field, exampleValues[field]!));
//             expect(buildFilterClause(filter)).toMatchSnapshot();
//         });
//     });

//     // Subsets of string fields
//     pickSubsets(stringFields, 2).forEach(combo => {
//         it(`handles string combination: ${combo.join(", ")}`, () => {
//             const filter: Partial<FilterState> = {};
//             combo.forEach(f => setFilterField(filter, f, normalizeField(f, exampleValues[f]!)));
//             expect(buildFilterClause(filter)).toMatchSnapshot();
//         });
//     });

//     // Subsets of array fields
//     pickSubsets(arrayFields, 2).forEach(combo => {
//         it(`handles array combination: ${combo.join(", ")}`, () => {
//             const filter: Partial<FilterState> = {};
//             combo.forEach(f => setFilterField(filter, f, normalizeField(f, exampleValues[f]!)));
//             expect(buildFilterClause(filter)).toMatchSnapshot();
//         });
//     });

//     // Mixed: string + boolean + array
//     stringFields.forEach(s => {
//         booleanFields.forEach(b => {
//             arrayFields.forEach(a => {
//                 it(`handles combination: ${s} + ${b} + ${a}`, () => {
//                     const filter: Partial<FilterState> = {};
//                     setFilterField(filter, s, normalizeField(s, exampleValues[s]!));
//                     setFilterField(filter, b, exampleValues[b]!);
//                     setFilterField(filter, a, normalizeField(a, exampleValues[a]!));
//                     expect(buildFilterClause(filter)).toMatchSnapshot();
//                 });
//             });
//         });
//     });

//     // All fields together
//     it("handles all fields combined", () => {
//         const filter: Partial<FilterState> = {};
//         [...stringFields, ...arrayFields].forEach(f => setFilterField(filter, f, normalizeField(f, exampleValues[f]!)));
//         booleanFields.forEach(f => setFilterField(filter, f, exampleValues[f]!));
//         expect(buildFilterClause(filter)).toMatchSnapshot();
//     });

//     // Edge cases
//     it("returns empty string for empty object", () => {
//         expect(buildFilterClause({})).toBe("");
//     });

//     it("ignores undefined values", () => {
//         const filter: Partial<FilterState> = {};
//         [...stringFields, ...booleanFields, ...arrayFields].forEach(f => setFilterField(filter, f, undefined));
//         expect(buildFilterClause(filter)).toBe("");
//     });

//     it("returns empty string for empty arrays", () => {
//         expect(buildFilterClause({ tags: [], dietary: [], products: [] })).toBe("");
//     });
// });

import { buildFilterClause } from "./buildFilterClause";
import { FilterState } from "@/models/filters";

// --- Example values --------------------------------------------------------
const exampleValues: Partial<FilterState> = {
    title: "  Pizza  ",
    cuisine: "iTAlian",
    "source.url": "EXAMPLE.com",
    "source.book": "Cookbook",
    "source.title": "SourceTitle",
    "source.author": "AuthorName",
    "source.where": "Library",
    kizia: true,
    tags: ["Vegan", "Quick"],
    dietary: ["Gluten-Free"],
    products: ["Tomato", "Cheese"],
};

// --- Normalization helpers -------------------------------------------------
const normalizeString = (v: string) => v.trim().toLowerCase();
const normalizeArray = (arr?: string[]) => arr?.map(v => v.toLowerCase()) ?? [];

function normalizeField<K extends keyof FilterState>(key: K, value: FilterState[K]): FilterState[K] {
    if (typeof value === "string") return normalizeString(value) as FilterState[K];
    if (Array.isArray(value)) return normalizeArray(value) as FilterState[K];
    return value;
}

function set<K extends keyof FilterState>(t: Partial<FilterState>, key: K, v: FilterState[K] | undefined) {
    t[key] = v;
}

// --- Field groups ----------------------------------------------------------
const stringFields: (keyof FilterState)[] = ["title", "cuisine", "source.url", "source.book", "source.title", "source.author", "source.where", "status"];

const booleanFields: (keyof FilterState)[] = ["kizia"];
const arrayFields: (keyof FilterState)[] = ["tags", "dietary", "products"];

// --- Subset generator ------------------------------------------------------
function subsets<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    const helper = (start: number, curr: T[]) => {
        if (curr.length === size) return void result.push([...curr]);
        for (let i = start; i < arr.length; i++) {
            curr.push(arr[i]);
            helper(i + 1, curr);
            curr.pop();
        }
    };
    helper(0, []);
    return result;
}

// --- Test suite ------------------------------------------------------------
describe("buildFilterClause – combinatorial Jest test suite", () => {
    // Single-field tests
    [...stringFields, ...booleanFields, ...arrayFields].forEach(field => {
        test(`single field: ${field}`, () => {
            const f: Partial<FilterState> = {};
            set(f, field, normalizeField(field, exampleValues[field]!));
            expect(buildFilterClause(f)).toMatchSnapshot();
        });
    });

    // 2-field combos: strings
    subsets(stringFields, 2).forEach(combo => {
        test(`string combo: ${combo.join(", ")}`, () => {
            const f: Partial<FilterState> = {};
            combo.forEach(k => set(f, k, normalizeField(k, exampleValues[k]!)));
            expect(buildFilterClause(f)).toMatchSnapshot();
        });
    });

    // 2-field combos: arrays
    subsets(arrayFields, 2).forEach(combo => {
        test(`array combo: ${combo.join(", ")}`, () => {
            const f: Partial<FilterState> = {};
            combo.forEach(k => set(f, k, normalizeField(k, exampleValues[k]!)));
            expect(buildFilterClause(f)).toMatchSnapshot();
        });
    });

    // Mixed: one string + one boolean + one array
    stringFields.forEach(s => {
        booleanFields.forEach(b => {
            arrayFields.forEach(a => {
                test(`mixed: ${s} + ${b} + ${a}`, () => {
                    const f: Partial<FilterState> = {};
                    set(f, s, normalizeField(s, exampleValues[s]!));
                    set(f, b, exampleValues[b]!);
                    set(f, a, normalizeField(a, exampleValues[a]!));
                    expect(buildFilterClause(f)).toMatchSnapshot();
                });
            });
        });
    });

    // All fields
    test("all fields", () => {
        const f: Partial<FilterState> = {};
        [...stringFields, ...arrayFields].forEach(k => set(f, k, normalizeField(k, exampleValues[k]!)));
        booleanFields.forEach(k => set(f, k, exampleValues[k]!));
        expect(buildFilterClause(f)).toMatchSnapshot();
    });

    // Edge cases
    test("empty object → empty string", () => {
        expect(buildFilterClause({})).toBe("");
    });

    test("all undefined → empty string", () => {
        const f: Partial<FilterState> = {};
        [...stringFields, ...booleanFields, ...arrayFields].forEach(k => set(f, k, undefined));
        expect(buildFilterClause(f)).toBe("");
    });

    test("empty arrays only → empty string", () => {
        expect(buildFilterClause({ tags: [], dietary: [], products: [] })).toBe("");
    });
});

// ale wyższy suite też działa dobrze
