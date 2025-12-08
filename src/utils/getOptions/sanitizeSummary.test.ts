import { sanitizeSummary } from "./sanitizeSummary";
import { CLEAN_SUMMARY_MESSAGES } from "./helpers";
import type { RecipeFilter } from "@/types";

describe("sanitizeSummary - comprehensive scenarios", () => {
    const validInput: RecipeFilter = {
        title: ["Recipe 1"],
        cuisine: ["Italian"],
        tags: ["Quick"],
        dietary: ["Vegan"],
        products: ["Tomato"],
        "source.url": ["https://example.com"],
        "source.book": ["Some Book"],
        "source.title": ["Book Title"],
        "source.author": ["John Doe"],
        "source.where": ["online"],
    };

    test("1️⃣ detects when a non-object is passed", () => {
        const result = sanitizeSummary(null);
        expect(result.sanitizedSummary).toEqual({
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.url": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        });
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_AN_OBJECT("object"));
    });

    test("2️⃣ detects extra fields beyond RecipeFilter", () => {
        const input = { ...validInput, extraField: ["oops"] } as unknown;
        const result = sanitizeSummary(input);
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.UNEXPECTED_FIELD("extraField"));
    });

    test("3️⃣ detects missing fields", () => {
        const input = { title: ["Only titles"] } as Partial<RecipeFilter>;
        const result = sanitizeSummary(input);

        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("cuisine"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("tags"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("dietary"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("products"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("source.url"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("source.book"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("source.title"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("source.author"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("source.where"));
    });

    test("4️⃣ ensures all key values are arrays and records faults", () => {
        const input = {
            title: ["Valid"],
            cuisine: "Not an array" as unknown as string[],
            tags: ["Okay"],
            dietary: null as unknown as string[],
            products: ["Fine"],
            "source.url": "https://oops" as unknown as string[],
            "source.book": null as unknown as string[],
            "source.title": undefined as unknown as string[],
            "source.author": null as unknown as string[],
            "source.where": 123 as unknown as string[],
        } as unknown as RecipeFilter;

        const result = sanitizeSummary(input);

        const emptyFields: (keyof RecipeFilter)[] = ["cuisine", "dietary", "source.url", "source.book", "source.title", "source.author", "source.where"];

        for (const key of emptyFields) {
            expect(result.sanitizedSummary[key]).toEqual([]);
        }

        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("cuisine", "string"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("dietary", "object"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("source.url", "string"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("source.book", "object"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("source.title", "undefined"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("source.author", "object"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("source.where", "number"));
    });

    test("5️⃣ removes faulty array values", () => {
        const input: RecipeFilter = {
            ...validInput,
            title: ["Good", "", null as unknown as string],
        };

        const result = sanitizeSummary(input);

        expect(result.sanitizedSummary.title).toEqual(["Good"]);
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(""));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(null));
    });

    test("6️⃣ handles empty arrays and preserves them", () => {
        const input: RecipeFilter = {
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.url": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const result = sanitizeSummary(input);
        expect(result.sanitizedSummary).toEqual(input);
        expect(result.sanitizeIssues).toHaveLength(0);
    });

    test("7️⃣ complex mix of valid, empty, and faulty values", () => {
        const input: RecipeFilter = {
            title: ["Valid", "", null as unknown as string],
            cuisine: ["Italian", ""],
            tags: ["Quick", null as unknown as string],
            dietary: ["Vegan", ""],
            products: ["Tomato", ""],
            "source.url": ["https://site.com", ""],
            "source.book": ["Book Name", ""],
            "source.title": ["Book Title", ""],
            "source.author": ["John Doe", ""],
            "source.where": ["online", ""],
        };

        const result = sanitizeSummary(input);

        expect(result.sanitizedSummary.title).toEqual(["Valid"]);
        expect(result.sanitizedSummary.cuisine).toEqual(["Italian"]);
        expect(result.sanitizedSummary.tags).toEqual(["Quick"]);
        expect(result.sanitizedSummary.dietary).toEqual(["Vegan"]);
        expect(result.sanitizedSummary.products).toEqual(["Tomato"]);
        expect(result.sanitizedSummary["source.url"]).toEqual(["https://site.com"]);
        expect(result.sanitizedSummary["source.book"]).toEqual(["Book Name"]);
        expect(result.sanitizedSummary["source.title"]).toEqual(["Book Title"]);
        expect(result.sanitizedSummary["source.author"]).toEqual(["John Doe"]);
        expect(result.sanitizedSummary["source.where"]).toEqual(["online"]);

        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(""));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(null));
    });

    test("8️⃣ flattens source object correctly", () => {
        const input = {
            title: ["R1"],
            cuisine: ["French"],
            tags: ["Easy"],
            dietary: ["Vegetarian"],
            products: ["Cheese"],
            source: {
                http: ["https://flatten.com"],
                book: ["Book Flat"],
                title: ["Title Flat"],
                author: ["Author Flat"],
                where: ["online"],
            },
        } as unknown;

        const result = sanitizeSummary(input);

        expect(result.sanitizedSummary["source.url"]).toEqual(["https://flatten.com"]);
        expect(result.sanitizedSummary["source.book"]).toEqual(["Book Flat"]);
        expect(result.sanitizedSummary["source.title"]).toEqual(["Title Flat"]);
        expect(result.sanitizedSummary["source.author"]).toEqual(["Author Flat"]);
        expect(result.sanitizedSummary["source.where"]).toEqual(["online"]);
    });
});
