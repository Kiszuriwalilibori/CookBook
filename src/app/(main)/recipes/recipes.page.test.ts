// import React from "react";
// import { render, screen } from "@testing-library/react";

// import { Recipe, Status } from "@/types";

// // --- Mocks ---
// jest.mock("@/utils/client", () => ({
//     client: {
//         fetch: jest.fn(),
//     },
// }));

// jest.mock("@/utils/getRecipesForCards", () => ({
//     getRecipesForCards: jest.fn(),
// }));

// jest.mock("./RecipesClient", () => ({
//     __esModule: true,
//     default: jest.fn(({ initialRecipes }: { initialRecipes?: unknown[] }) =>
//         React.createElement("div", {
//             "data-testid": "recipes-client",
//             "data-props": JSON.stringify({ initialRecipes }),
//         })
//     ),
// }));

// import RecipesPage from "./page";
// import { getRecipesForCards } from "@/utils/getRecipesForCards";

// const mockedGetRecipesForCards = getRecipesForCards as jest.MockedFunction<typeof getRecipesForCards>;

// describe("RecipesPage (server component)", () => {
//     beforeEach(() => jest.clearAllMocks());

//     test("parses searchParams correctly and normalizes filters", async () => {
//         const searchParams = Promise.resolve({
//             title: "Pasta",
//             cuisine: "Italian",
//             tags: ["VEGAN", "Quick"],
//             dietary: "GLUTEN-FREE",
//             products: ["Tomato"],
//             "source.url": "HTTPVal",
//             "source.book": "BookVal",
//             "source.title": "TitleVal",
//             "source.author": "AuthorVal",
//             "source.where": "WhereVal",
//             kizia: "true",
//             status: "Good",
//         });

//         const fakeRecipes: Recipe[] = [{ _id: "1", title: "Test", cuisine: ["italian"], tags: [], dietary: [], products: [], source: {}, _createdAt: "", _updatedAt: "", status: Status.Good }];

//         mockedGetRecipesForCards.mockResolvedValueOnce(fakeRecipes);

//         const element = await RecipesPage({ searchParams });
//         render(element as React.ReactElement);

//         const calledFilters = mockedGetRecipesForCards.mock.calls[0]?.[0];
//         if (!calledFilters) throw new Error("Filters not called");

//         expect(calledFilters.title).toBe("pasta");
//         expect(calledFilters.cuisine).toEqual(["italian"]);
//         expect(calledFilters.tags).toEqual(["vegan", "quick"]);
//         expect(calledFilters.dietary).toEqual(["gluten-free"]);
//         expect(calledFilters.products).toEqual(["tomato"]);
//         expect(calledFilters["source.url"]).toBe("httpval");
//         expect(calledFilters["source.book"]).toBe("bookval");
//         expect(calledFilters["source.title"]).toBe("titleval");
//         expect(calledFilters["source.author"]).toBe("authorval");
//         expect(calledFilters["source.where"]).toBe("whereval");
//         expect(calledFilters.kizia).toBe(true);
//         expect(calledFilters.status).toBe("Good");

//         const client = screen.getByTestId("recipes-client");
//         const props = JSON.parse(client.getAttribute("data-props")!);
//         expect(props.initialRecipes).toEqual(fakeRecipes);
//     });

//     test("handles missing or empty searchParams correctly", async () => {
//         const searchParams = Promise.resolve({});

//         mockedGetRecipesForCards.mockResolvedValueOnce([]);

//         const element = await RecipesPage({ searchParams });
//         render(element as React.ReactElement);

//         const calledFilters = mockedGetRecipesForCards.mock.calls[0]?.[0];
//         if (!calledFilters) throw new Error("Filters not called");

//         expect(calledFilters.title).toBeUndefined();
//         expect(calledFilters.cuisine).toEqual([]);
//         expect(calledFilters.tags).toEqual([]);
//         expect(calledFilters.dietary).toEqual([]);
//         expect(calledFilters.products).toEqual([]);
//         expect(calledFilters.kizia).toBeUndefined();
//         expect(calledFilters.status).toBeUndefined();

//         expect(screen.getByTestId("recipes-client")).toBeInTheDocument();
//     });

//     test("renders RecipesClient even if getRecipesForCards throws", async () => {
//         const searchParams = Promise.resolve({});

//         mockedGetRecipesForCards.mockRejectedValueOnce(new Error("DB failure"));

//         const element = await RecipesPage({ searchParams });
//         render(element as React.ReactElement);

//         const client = screen.getByTestId("recipes-client");
//         const props = JSON.parse(client.getAttribute("data-props")!);
//         expect(props.initialRecipes).toEqual([]);
//     });
// });
import React from "react";
import { render, screen } from "@testing-library/react";

import { Recipe, Status } from "@/types";

// ==================== MOCKS ====================

jest.mock(
    "../../../lib/env",
    () => ({
        projectId: "test-project-id",
        dataset: "test-dataset",
        apiVersion: "2023-01-01",
        useCdn: false,
        token: "test-token",
    }),
    { virtual: true }
);

jest.mock("@/utils/client", () => ({
    client: { fetch: jest.fn() },
}));

jest.mock("@/utils/writeClient", () => ({
    writeClient: { fetch: jest.fn(), create: jest.fn(), delete: jest.fn() },
}));

jest.mock("@/utils/getRecipesForCards", () => ({
    getRecipesForCards: jest.fn(),
}));
jest.mock("@/utils/getRecipeById", () => ({
    getRecipeById: jest.fn(),
}));

jest.mock("./RecipesClient", () => ({
    __esModule: true,
    default: jest.fn(({ initialRecipes, initialFavorites }: { initialRecipes?: unknown[]; initialFavorites?: string[] }) =>
        React.createElement("div", {
            "data-testid": "recipes-client",
            "data-props": JSON.stringify({ initialRecipes, initialFavorites }),
        })
    ),
}));

// ==================== TESTY ====================

import RecipesPage from "./page";
import { getRecipesForCards } from "@/utils/getRecipesForCards";

const mockedGetRecipesForCards = getRecipesForCards as jest.MockedFunction<typeof getRecipesForCards>;

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
            "source.url": "HTTPVal",
            "source.book": "BookVal",
            "source.title": "TitleVal",
            "source.author": "AuthorVal",
            "source.where": "WhereVal",
            kizia: "true",
            status: "Good",
        });

        const fakeRecipes: Recipe[] = [
            {
                _id: "1",
                title: "Test",
                cuisine: ["italian"],
                tags: [],
                dietary: [],
                products: [],
                source: {},
                _createdAt: "",
                _updatedAt: "",
                status: Status.Good,
            },
        ];

        mockedGetRecipesForCards.mockResolvedValueOnce(fakeRecipes);

        const element = await RecipesPage({ searchParams });
        render(element as React.ReactElement);

        const calledFilters = mockedGetRecipesForCards.mock.calls[0]?.[0];
        if (!calledFilters) throw new Error("Filters not called");

        expect(calledFilters.title).toBe("pasta");
        expect(calledFilters.cuisine).toEqual(["italian"]);
        expect(calledFilters.tags).toEqual(["vegan", "quick"]);
        expect(calledFilters.dietary).toEqual(["gluten-free"]);
        expect(calledFilters.products).toEqual(["tomato"]);
        expect(calledFilters["source.url"]).toBe("httpval");
        expect(calledFilters["source.book"]).toBe("bookval");
        expect(calledFilters["source.title"]).toBe("titleval");
        expect(calledFilters["source.author"]).toBe("authorval");
        expect(calledFilters["source.where"]).toBe("whereval");
        expect(calledFilters.kizia).toBe(true);
        expect(calledFilters.status).toEqual(["Good"]); // ← Poprawione!

        const client = screen.getByTestId("recipes-client");
        const props = JSON.parse(client.getAttribute("data-props")!);
        expect(props.initialRecipes).toEqual(fakeRecipes);
    });

    test("handles missing or empty searchParams correctly", async () => {
        const searchParams = Promise.resolve({});

        mockedGetRecipesForCards.mockResolvedValueOnce([]);

        const element = await RecipesPage({ searchParams });
        render(element as React.ReactElement);

        const calledFilters = mockedGetRecipesForCards.mock.calls[0]?.[0];
        if (!calledFilters) throw new Error("Filters not called");

        expect(calledFilters.title).toBeUndefined();
        expect(calledFilters.cuisine).toEqual([]);
        expect(calledFilters.tags).toEqual([]);
        expect(calledFilters.dietary).toEqual([]);
        expect(calledFilters.products).toEqual([]);
        expect(calledFilters.kizia).toBeUndefined();
        expect(calledFilters.status).toBeUndefined();

        expect(screen.getByTestId("recipes-client")).toBeInTheDocument();
    });

    test("renders RecipesClient even if getRecipesForCards throws", async () => {
        const searchParams = Promise.resolve({});

        mockedGetRecipesForCards.mockRejectedValueOnce(new Error("DB failure"));

        const element = await RecipesPage({ searchParams });
        render(element as React.ReactElement);

        const client = screen.getByTestId("recipes-client");
        const props = JSON.parse(client.getAttribute("data-props")!);
        expect(props.initialRecipes).toEqual([]);
    });
});
