import { sanitizeSummary } from "./sanitizeSummary";
import { CLEAN_SUMMARY_MESSAGES } from "./helpers";
import type { RecipeFilter } from "@/types";

describe("cleanSummary", () => {
    const validInput: RecipeFilter = {
        title: ["Recipe 1"],
        cuisine: ["Italian"],
        tags: ["Quick"],
        dietary: ["Vegan"],
        products: ["Tomato"],
    };

    test("1️⃣ detects when a non-object is passed", () => {
        const result = sanitizeSummary(null);
        expect(result.sanitizedSummary).toEqual({
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
        });
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_AN_OBJECT("object"));
    });

    test("2️⃣ detects extra fields beyond RecipeFilter", () => {
        const input = {
            ...validInput,
            extraField: ["oops"],
        } as unknown as RecipeFilter;

        const result = sanitizeSummary(input);

        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.UNEXPECTED_FIELD("extraField"));
    });

    test("3️⃣ detects missing fields", () => {
        const input = {
            title: ["Only titles"],
        } as Partial<RecipeFilter>;

        const result = sanitizeSummary(input);

        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("cuisine"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("tags"));
    });

    test("4️⃣ ensures all key values are arrays and records faults", () => {
        const input = {
            title: ["Valid"],
            cuisine: "Not an array" as unknown as string[],
            tags: ["Okay"],
            dietary: null as unknown as string[],
            products: ["Fine"],
        } as unknown as RecipeFilter;

        const result = sanitizeSummary(input);

        expect(result.sanitizedSummary.cuisine).toEqual([]);
        expect(result.sanitizedSummary.dietary).toEqual([]);

        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("cuisine", "string"));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("dietary", "object"));
    });

    test("5️⃣ removes faulty array values", () => {
        const input = {
            ...validInput,
            titles: ["Good", "", null as unknown as string],
        };

        const result = sanitizeSummary(input);

        expect(result.sanitizedSummary.title).toEqual(["Good"]);
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(""));
        expect(result.sanitizeIssues).toContain(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(null));
    });
});
