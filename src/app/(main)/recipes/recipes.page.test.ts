import React from "react";
import { render, screen } from "@testing-library/react";
import RecipesPage from "./page";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { Recipe } from "@/types";

// --- Mocks ---

jest.mock("@/utils/getRecipesForCards", () => ({
    getRecipesForCards: jest.fn(),
}));

jest.mock("./RecipesClient", () => ({
    __esModule: true,
    default: jest.fn((props: { initialRecipes?: unknown[] }) => {
        return React.createElement("div", {
            "data-testid": "recipes-client",
            "data-props": JSON.stringify(props),
        });
    }),
}));

const mockedGetRecipesForCards = getRecipesForCards as unknown as jest.MockedFunction<typeof getRecipesForCards>;

describe("RecipesPage (server component)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("parses searchParams correctly and normalizes filters", async () => {
        const searchParams = Promise.resolve({
            title: "Pasta",
            cuisine: "Italian",
            tags: ["VEGAN", "Quick"],
            dietary: "GLUTEN-FREE",
            products: ["Tomato"],
            "source.http": "HTTPVal",
            "source.book": "BookVal",
            "source.title": "TitleVal",
            "source.author": "AuthorVal",
            "source.where": "WhereVal",
            kizia: "true",
            status: "Good",
        } as { [key: string]: string | string[] | undefined });

        const fakeRecipes: Recipe[] = [{ id: "1", title: "Test", cuisine: "italian", tags: [], dietary: [], products: [], source: {} } as unknown as Recipe];

        mockedGetRecipesForCards.mockResolvedValueOnce(fakeRecipes);

        const element = await RecipesPage({ searchParams });
        render(element as React.ReactElement);

        // Verify normalized filters
        expect(mockedGetRecipesForCards).toHaveBeenCalledTimes(1);
        const calledFilters = mockedGetRecipesForCards.mock.calls[0]?.[0];
        expect(calledFilters).toBeDefined();

        if (!calledFilters) throw new Error("Filters not called");

        expect(calledFilters.title).toBe("pasta");
        expect(calledFilters.cuisine).toBe("italian");
        expect(calledFilters.tags).toEqual(["vegan", "quick"]);
        expect(calledFilters.dietary).toEqual(["gluten-free"]);
        expect(calledFilters.products).toEqual(["tomato"]);
        expect(calledFilters["source.http"]).toBe("httpval");
        expect(calledFilters["source.book"]).toBe("bookval");
        expect(calledFilters["source.title"]).toBe("titleval");
        expect(calledFilters["source.author"]).toBe("authorval");
        expect(calledFilters["source.where"]).toBe("whereval");
        expect(calledFilters.kizia).toBe(true);
        expect(calledFilters.status).toBe("Good");

        // Ensure RecipesClient received the same recipes
        const client = screen.getByTestId("recipes-client");
        const props = JSON.parse(client.getAttribute("data-props") as string);
        expect(props.initialRecipes).toEqual(fakeRecipes);
    });

    test("handles missing or empty searchParams correctly", async () => {
        const searchParams = Promise.resolve({} as { [key: string]: string | string[] | undefined });

        mockedGetRecipesForCards.mockResolvedValueOnce([]);

        const element = await RecipesPage({ searchParams });
        render(element as React.ReactElement);

        const calledFilters = mockedGetRecipesForCards.mock.calls[0]?.[0];
        expect(calledFilters).toBeDefined();
        if (!calledFilters) throw new Error("Filters not called");

        expect(calledFilters.title).toBeUndefined();
        expect(calledFilters.cuisine).toBeUndefined();
        expect(calledFilters.tags).toEqual([]);
        expect(calledFilters.dietary).toEqual([]);
        expect(calledFilters.products).toEqual([]);
        expect(calledFilters.kizia).toBeUndefined();
        expect(calledFilters.status).toBeNull();

        expect(screen.getByTestId("recipes-client")).toBeInTheDocument();
    });

    test("renders RecipesClient even if getRecipesForCards throws", async () => {
        const searchParams = Promise.resolve({} as { [key: string]: string | string[] | undefined });

        mockedGetRecipesForCards.mockRejectedValueOnce(new Error("DB failure"));

        const element = await RecipesPage({ searchParams });
        render(element as React.ReactElement);

        const client = screen.getByTestId("recipes-client");
        const props = JSON.parse(client.getAttribute("data-props") as string);
        expect(props.initialRecipes).toEqual([]);
    });
});
