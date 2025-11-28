import { ensureSummaryStructure } from "./ensureSummaryStructure";
import type { RecipeFilter } from "@/types";
import { initialSummary } from "./helpers";

describe("ensureSummaryStructure", () => {
    test("1️⃣ returns a complete summary when partialSummary is empty", () => {
        const result = ensureSummaryStructure({});
        expect(result).toEqual(initialSummary);
    });

    test("2️⃣ preserves existing array fields in partialSummary", () => {
        const partial: Partial<RecipeFilter> = {
            title: ["Recipe 1"],
            cuisine: ["Italian"],
            products: ["Tomato"],
        };

        const result = ensureSummaryStructure(partial);
        expect(result.title).toEqual(["Recipe 1"]);
        expect(result.cuisine).toEqual(["Italian"]);
        expect(result.products).toEqual(["Tomato"]);

        // Other fields fallback to initialSummary (empty arrays)
        expect(result.tags).toEqual([]);
        expect(result.dietary).toEqual([]);
        expect(result["source.http"]).toEqual([]);
        expect(result["source.book"]).toEqual([]);
        expect(result["source.title"]).toEqual([]);
        expect(result["source.author"]).toEqual([]);
        expect(result["source.where"]).toEqual([]);
    });

    test("3️⃣ flattens legacy source object if present", () => {
        const partialWithSource = {
            title: ["Recipe 1"],
            source: {
                http: ["https://example.com"],
                author: ["Jane Doe"],
            },
        } as unknown as Partial<RecipeFilter> & { source?: Record<string, string[]> };

        const result = ensureSummaryStructure(partialWithSource);

        expect(result.title).toEqual(["Recipe 1"]);
        expect(result["source.http"]).toEqual(["https://example.com"]);
        expect(result["source.author"]).toEqual(["Jane Doe"]);

        // Other source fields fallback
        expect(result["source.book"]).toEqual([]);
        expect(result["source.title"]).toEqual([]);
        expect(result["source.where"]).toEqual([]);
    });

    test("4️⃣ handles all fields correctly when fully populated", () => {
        const fullPartial: Partial<RecipeFilter> = {
            title: ["T1"],
            cuisine: ["Italian"],
            tags: ["Quick"],
            dietary: ["Vegan"],
            products: ["Tomato"],
            "source.http": ["https://example.com"],
            "source.book": ["Book 1"],
            "source.title": ["Book Title"],
            "source.author": ["Jane Doe"],
            "source.where": ["online"],
        };

        const result = ensureSummaryStructure(fullPartial);
        expect(result).toEqual(fullPartial);
    });

    test("5️⃣ ensures empty arrays for missing keys", () => {
        const partial: Partial<RecipeFilter> = {
            title: ["Recipe 1"],
        };

        const result = ensureSummaryStructure(partial);

        expect(result.cuisine).toEqual([]);
        expect(result.tags).toEqual([]);
        expect(result.dietary).toEqual([]);
        expect(result.products).toEqual([]);
        expect(result["source.http"]).toEqual([]);
        expect(result["source.book"]).toEqual([]);
        expect(result["source.title"]).toEqual([]);
        expect(result["source.author"]).toEqual([]);
        expect(result["source.where"]).toEqual([]);
    });
});
