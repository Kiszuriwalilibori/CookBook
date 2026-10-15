// import { getRecipesForCards } from "./getRecipesForCards";
// import { client } from "./client";

// /*
//  * Co sprawdzają testy:
//  * - Jeśli pobieranie przepisów z Sanity zakończy się błędem,
//  *   funkcja getRecipesForCards przekazuje ten błąd dalej,
//  *   zamiast go ukrywać.
//  */

// jest.mock("next-sanity", () => ({
//     groq: (strings: TemplateStringsArray, ...values: unknown[]) => strings.reduce((result, string, index) => result + string + (values[index] ?? ""), ""),
// }));

// jest.mock("./client", () => ({
//     client: {
//         fetch: jest.fn(),
//     },
// }));

// jest.mock("./buildFilterClause", () => ({
//     buildFilterClause: jest.fn(() => ""),
// }));

// jest.mock("@/utils/projections/recipeCardProjection", () => ({
//     recipeCardProjection: "",
// }));

// describe("getRecipesForCards", () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it("rethrows an error when fetching recipes fails", async () => {
//         const error = new Error("Fetch failed");

//         jest.mocked(client.fetch).mockRejectedValueOnce(error);

//         await expect(getRecipesForCards(undefined, true)).rejects.toThrow(error);
//     });
// });

/*
 * Co sprawdzają testy:
 * - Wartości filtrów są przekazywane do Sanity jako parametry,
 *   a nie wstawiane bezpośrednio do zapytania GROQ.
 * - Tekst przypominający atak GROQ nie zmienia struktury zapytania.
 * - Zwykły użytkownik bez wybranego statusu widzi przepisy
 *   o statusie Good lub Acceptable.
 * - Administrator nie otrzymuje domyślnego filtra statusu.
 * - Błąd pobierania przepisów jest przekazywany dalej.
 */

import { getRecipesForCards } from "./getRecipesForCards";
import { client } from "./client";

jest.mock("next-sanity", () => ({
    groq: (strings: TemplateStringsArray, ...values: unknown[]) => strings.reduce((result, string, index) => result + string + (values[index] ?? ""), ""),
}));

jest.mock("./client", () => ({
    client: {
        fetch: jest.fn(),
    },
}));

jest.mock("@/utils/projections/recipeCardProjection", () => ({
    recipeCardProjection: "",
}));

describe("getRecipesForCards", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("passes filter values separately from the GROQ query", async () => {
        const payload = 'pizza" || true || title match "*';

        jest.mocked(client.fetch).mockResolvedValueOnce([] as never);

        await getRecipesForCards(
            {
                title: payload,
                tags: ["vegan"],
            },
            true
        );

        expect(client.fetch).toHaveBeenCalledTimes(1);

        const [query, params] = jest.mocked(client.fetch).mock.calls[0];

        expect(query).toContain("lower(title) match $filter_title");
        expect(query).toContain("count((tags[])[@ in $filter_tags]) > 0");
        expect(query).not.toContain(payload);

        expect(params).toEqual({
            filter_title: `${payload}*`,
            filter_tags: ["vegan"],
        });
    });

    it("applies default statuses for non-admin users", async () => {
        jest.mocked(client.fetch).mockResolvedValueOnce([] as never);

        await getRecipesForCards(undefined, false);

        const [, params] = jest.mocked(client.fetch).mock.calls[0];

        expect(params).toEqual({
            filter_status: ["good", "acceptable"],
        });
    });

    it("does not add default statuses for admin users", async () => {
        jest.mocked(client.fetch).mockResolvedValueOnce([] as never);

        await getRecipesForCards(undefined, true);

        expect(client.fetch).toHaveBeenCalledTimes(1);
        expect(client.fetch).toHaveBeenCalledWith(expect.any(String), {});
    });

    it("rethrows an error when fetching recipes fails", async () => {
        const error = new Error("Fetch failed");

        jest.mocked(client.fetch).mockRejectedValueOnce(error);

        await expect(getRecipesForCards(undefined, true)).rejects.toThrow(error);
    });
});
