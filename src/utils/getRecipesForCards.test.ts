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

jest.mock("./buildFilterClause", () => ({
    buildFilterClause: jest.fn(() => ""),
}));

jest.mock("@/utils/projections/recipeCardProjection", () => ({
    recipeCardProjection: "",
}));

describe("getRecipesForCards", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("rethrows an error when fetching recipes fails", async () => {
        const error = new Error("Fetch failed");

        jest.mocked(client.fetch).mockRejectedValueOnce(error);

        await expect(getRecipesForCards(undefined, true)).rejects.toThrow(error);
    });
});
