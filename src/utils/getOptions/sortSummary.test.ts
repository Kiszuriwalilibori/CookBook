import { sortSummary } from "./sortSummary";
import type { RecipeFilter } from "@/types";

describe("sortSummary", () => {
    test("sorts top-level arrays alphabetically using Polish locale", () => {
        const input: RecipeFilter = {
            title: ["Zorro", "Ąbel", "Żaba"],
            cuisine: ["Włoska", "Angielska"],
            tags: ["Szybkie", "łatwe"], // <- key case!
            dietary: ["wegańskie", "Bezglutenowe"],
            products: ["arbuz", "Pomidor"],
            "source.url": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const result = sortSummary(input);

        expect(result.title).toEqual(["Ąbel", "Zorro", "Żaba"]);
        expect(result.cuisine).toEqual(["Angielska", "Włoska"]);

        // *** Correct Polish alphabetical order ***
        // ł < s → "łatwe" BEFORE "Szybkie"
        expect(result.tags).toEqual(["łatwe", "Szybkie"]);

        expect(result.dietary).toEqual(["Bezglutenowe", "wegańskie"]);
        expect(result.products).toEqual(["arbuz", "Pomidor"]);
    });

    test("sorts all source.* arrays", () => {
        const input: RecipeFilter = {
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.url": ["https://B.com", "https://a.com"],
            "source.book": ["Zorro", "Ąbel"],
            "source.title": ["Żółw", "Ala"],
            "source.author": ["Świat", "Roma"],
            "source.where": ["sufit", "Łąka"],
        };

        const result = sortSummary(input);

        expect(result["source.url"]).toEqual(["https://a.com", "https://B.com"]);
        expect(result["source.book"]).toEqual(["Ąbel", "Zorro"]);
        expect(result["source.title"]).toEqual(["Ala", "Żółw"]);

        // Polish: Ł < R < Ś
        expect(result["source.author"]).toEqual(["Roma", "Świat"]);

        // Polish: Ł < S
        expect(result["source.where"]).toEqual(["Łąka", "sufit"]);
    });
});
