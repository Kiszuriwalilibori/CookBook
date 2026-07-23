// import { buildFilterClause } from "./buildFilterClause";
// import { FilterState } from "@/models/filters";

// // --- Example values --------------------------------------------------------
// import { Status } from "@/types";

// const exampleValues: Partial<FilterState> = {
//     title: "  Pizza  ",
//     cuisine: ["iTAlian"],
//     status: [Status.Good],
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

// // --- Normalization helpers -------------------------------------------------
// const normalizeString = (v: string) => v.trim().toLowerCase();
// const normalizeArray = (arr?: string[]) => arr?.map(v => v.toLowerCase()) ?? [];

// function normalizeField<K extends keyof FilterState>(key: K, value: FilterState[K]): FilterState[K] {
//     if (typeof value === "string") return normalizeString(value) as FilterState[K];
//     if (Array.isArray(value)) return normalizeArray(value) as FilterState[K];
//     return value;
// }

// function set<K extends keyof FilterState>(t: Partial<FilterState>, key: K, v: FilterState[K] | undefined) {
//     t[key] = v;
// }

// // --- Field groups ----------------------------------------------------------
// const stringFields: (keyof FilterState)[] = ["title", "source.url", "source.book", "source.title", "source.author", "source.where"];

// const booleanFields: (keyof FilterState)[] = ["kizia"];

// const arrayFields: (keyof FilterState)[] = ["cuisine", "status", "tags", "dietary", "products"];
// // --- Subset generator ------------------------------------------------------
// function subsets<T>(arr: T[], size: number): T[][] {
//     const result: T[][] = [];
//     const helper = (start: number, curr: T[]) => {
//         if (curr.length === size) return void result.push([...curr]);
//         for (let i = start; i < arr.length; i++) {
//             curr.push(arr[i]);
//             helper(i + 1, curr);
//             curr.pop();
//         }
//     };
//     helper(0, []);
//     return result;
// }

// // --- Test suite ------------------------------------------------------------
// describe("buildFilterClause – combinatorial Jest test suite", () => {
//     // Single-field tests
//     [...stringFields, ...booleanFields, ...arrayFields].forEach(field => {
//         test(`single field: ${field}`, () => {
//             const f: Partial<FilterState> = {};
//             set(f, field, normalizeField(field, exampleValues[field]!));
//             expect(buildFilterClause(f)).toMatchSnapshot();
//         });
//     });

//     // 2-field combos: strings
//     subsets(stringFields, 2).forEach(combo => {
//         test(`string combo: ${combo.join(", ")}`, () => {
//             const f: Partial<FilterState> = {};
//             combo.forEach(k => set(f, k, normalizeField(k, exampleValues[k]!)));
//             expect(buildFilterClause(f)).toMatchSnapshot();
//         });
//     });

//     // 2-field combos: arrays
//     subsets(arrayFields, 2).forEach(combo => {
//         test(`array combo: ${combo.join(", ")}`, () => {
//             const f: Partial<FilterState> = {};
//             combo.forEach(k => set(f, k, normalizeField(k, exampleValues[k]!)));
//             expect(buildFilterClause(f)).toMatchSnapshot();
//         });
//     });

//     // Mixed: one string + one boolean + one array
//     stringFields.forEach(s => {
//         booleanFields.forEach(b => {
//             arrayFields.forEach(a => {
//                 test(`mixed: ${s} + ${b} + ${a}`, () => {
//                     const f: Partial<FilterState> = {};
//                     set(f, s, normalizeField(s, exampleValues[s]!));
//                     set(f, b, exampleValues[b]!);
//                     set(f, a, normalizeField(a, exampleValues[a]!));
//                     expect(buildFilterClause(f)).toMatchSnapshot();
//                 });
//             });
//         });
//     });

//     // All fields
//     test("all fields", () => {
//         const f: Partial<FilterState> = {};
//         [...stringFields, ...arrayFields].forEach(k => set(f, k, normalizeField(k, exampleValues[k]!)));
//         booleanFields.forEach(k => set(f, k, exampleValues[k]!));
//         expect(buildFilterClause(f)).toMatchSnapshot();
//     });

//     // Edge cases
//     test("empty object → empty string", () => {
//         expect(buildFilterClause({})).toBe("");
//     });

//     test("all undefined → empty string", () => {
//         const f: Partial<FilterState> = {};
//         [...stringFields, ...booleanFields, ...arrayFields].forEach(k => set(f, k, undefined));
//         expect(buildFilterClause(f)).toBe("");
//     });

//     test("empty arrays only → empty string", () => {
//         expect(buildFilterClause({ tags: [], dietary: [], products: [] })).toBe("");
//     });
// });

// // ale wyższy suite też działa dobrze
import { buildFilterClause } from "./buildFilterClause";
import { FilterState } from "@/models/filters";

// --- Example values --------------------------------------------------------
import { Status } from "@/types";

const exampleValues: Partial<FilterState> = {
    title: "  Pizza  ",
    cuisine: ["iTAlian"],
    status: [Status.Good],
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
// Kolejność MUSI odpowiadać kolejności w buildFilterClause!
const statusField: (keyof FilterState)[] = ["status"];

const stringFields: (keyof FilterState)[] = ["title", "source.url", "source.book", "source.title", "source.author", "source.where"];

const arrayFields: (keyof FilterState)[] = ["cuisine", "tags", "dietary", "products"];

const booleanFields: (keyof FilterState)[] = ["kizia"];

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
    [...statusField, ...stringFields, ...arrayFields, ...booleanFields].forEach(field => {
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

    // Mixed: jedno string + jeden boolean + jedna tablica
    // WAŻNE: Kolejność w snapshocie to: string → array → boolean
    stringFields.forEach(s => {
        arrayFields.forEach(a => {
            booleanFields.forEach(b => {
                test(`mixed: ${s} + ${a} + ${b}`, () => {
                    const f: Partial<FilterState> = {};
                    set(f, s, normalizeField(s, exampleValues[s]!));
                    set(f, a, normalizeField(a, exampleValues[a]!));
                    set(f, b, exampleValues[b]!);
                    expect(buildFilterClause(f)).toMatchSnapshot();
                });
            });
        });
    });

    // All fields – kolejność zgodna z implementacją
    test("all fields", () => {
        const f: Partial<FilterState> = {};
        set(f, "status", normalizeField("status", exampleValues["status"]!));
        stringFields.forEach(k => set(f, k, normalizeField(k, exampleValues[k]!)));
        arrayFields.forEach(k => set(f, k, normalizeField(k, exampleValues[k]!)));
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
