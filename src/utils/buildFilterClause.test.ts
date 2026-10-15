import { buildFilterClause } from "./buildFilterClause";
import { Status } from "@/types";

/*
 * Co sprawdzają testy:
 * - Brak filtrów lub puste filtry nie generują warunków zapytania.
 * - Tytuł, pola źródła i listy filtrów są przekazywane jako parametry GROQ,
 *   a nie wstawiane bezpośrednio do tekstu zapytania.
 * - Wartości filtrów są normalizowane: usuwane są zbędne spacje
 *   i zamieniane są litery na małe.
 * - Statusy są ograniczone do dozwolonych wartości.
 * - Puste wartości nie tworzą zbędnych warunków.
 * - Filtr logiczny „kizia” generuje stały warunek.
 * - Dane przypominające wstrzyknięcie GROQ nie trafiają do tekstu zapytania.
 * - Dane użytkownika nie mogą zmieniać nazw pól używanych w zapytaniu.
 * - Nieprawidłowe elementy tablic filtrów są pomijane.
 */

describe("buildFilterClause", () => {
    it("returns an empty clause and no params for missing filters", () => {
        expect(buildFilterClause()).toEqual({
            clause: "",
            params: {},
        });
    });

    it("returns an empty clause and no params for empty filters", () => {
        expect(buildFilterClause({})).toEqual({
            clause: "",
            params: {},
        });
    });

    it("uses a parameter for the title prefix", () => {
        const result = buildFilterClause({ title: "  Pizza  " });

        expect(result.clause).toContain("lower(title) match $filter_title");
        expect(result.params).toEqual({ filter_title: "pizza*" });
        expect(result.clause).not.toContain("pizza");
    });

    it("normalizes source fields and passes values as params", () => {
        const result = buildFilterClause({
            "source.url": " EXAMPLE.COM ",
            "source.book": " Cookbook ",
        });

        expect(result.clause).toContain("lower(source.url) == $filter_source_url");
        expect(result.clause).toContain("lower(source.book) == $filter_source_book");
        expect(result.params).toEqual({
            filter_source_url: "example.com",
            filter_source_book: "cookbook",
        });
        expect(result.clause).not.toContain("example.com");
        expect(result.clause).not.toContain("cookbook");
    });

    it("passes array values as parameters instead of interpolating them", () => {
        const result = buildFilterClause({
            cuisine: [" Italian ", "FRENCH"],
            tags: ["Vegan"],
            dietary: ["Gluten-Free"],
            products: ["Tomato", "Cheese"],
        });

        expect(result.clause).toContain("count((cuisine[])[@ in $filter_cuisine]) > 0");
        expect(result.clause).toContain("count((tags[])[@ in $filter_tags]) > 0");
        expect(result.clause).toContain("count((dietary[])[@ in $filter_dietary]) > 0");
        expect(result.clause).toContain("count((products[])[@ in $filter_products]) > 0");

        expect(result.params).toEqual({
            filter_cuisine: ["italian", "french"],
            filter_tags: ["vegan"],
            filter_dietary: ["gluten-free"],
            filter_products: ["tomato", "cheese"],
        });
    });

    it("accepts only allowed status values", () => {
        const result = buildFilterClause({
            status: [Status.Good, Status.Acceptable, "unknown" as Status],
        });

        expect(result.clause).toContain("lower(status) in $filter_status");
        expect(result.params.filter_status).toEqual(["good", "acceptable"]);
        expect(result.clause).not.toContain("unknown");
    });

    it("omits empty arrays and empty strings", () => {
        const result = buildFilterClause({
            title: "   ",
            cuisine: [],
            tags: [" ", ""],
            dietary: [],
            products: [],
            "source.url": "",
        });

        expect(result).toEqual({ clause: "", params: {} });
    });

    it("includes the boolean condition without a user-controlled value", () => {
        const result = buildFilterClause({ kizia: true });

        expect(result.clause).toContain("kizia == true");
        expect(result.params).toEqual({});
    });

    it("does not interpolate GROQ injection payloads into the clause", () => {
        const payload = 'x" || true || title match "';
        const result = buildFilterClause({
            title: payload,
            "source.url": payload,
            tags: [payload],
            products: [payload],
        });

        expect(result.clause).not.toContain(payload);
        expect(result.params).toEqual({
            filter_title: `${payload.trim().toLowerCase()}*`,
            filter_source_url: payload.trim().toLowerCase(),
            filter_tags: [payload.trim().toLowerCase()],
            filter_products: [payload.trim().toLowerCase()],
        });
    });

    it("does not allow user data to define field names", () => {
        const result = buildFilterClause({
            title: "pizza",
            tags: ["quick"],
        });

        expect(result.clause).toBe(" && (lower(title) match $filter_title && " + "count((tags[])[@ in $filter_tags]) > 0)");
    });

    it("ignores malformed runtime array entries", () => {
        const result = buildFilterClause({
            tags: ["vegan", 123, null] as unknown as string[],
        });

        expect(result.params).toEqual({ filter_tags: ["vegan"] });
    });
});
