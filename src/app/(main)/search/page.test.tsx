/**
 * SearchPage wywołuje fetchSummary podczas renderowania strony.
 *
 * SearchPage przekazuje pobrane summary do SearchFilters.
 *
 * SearchPage nie renderuje SearchFilters, gdy summary jest niedostępne.
 */

import { render, screen } from "@testing-library/react";

import SearchPage from "./page";

import { fetchSummary } from "@/utils/fetchSummary";

import type { RecipeFilter } from "@/types";

jest.mock("@/utils/fetchSummary", () => ({
    fetchSummary: jest.fn(),
}));

jest.mock("./SearchFilters", () => ({
    __esModule: true,
    default: ({ options }: { options: RecipeFilter }) => (
        <div data-testid="search-filters">
            SearchFilters
            <span data-testid="search-filters-options">{JSON.stringify(options)}</span>
        </div>
    ),
}));

describe("SearchPage", () => {
    const summary: RecipeFilter = {
        title: ["Adżapsandali", "Leczo"],
        products: ["Kurczak", "Bakłażan"],
        tags: ["Obiad", "Szybkie"],
        dietary: ["Wegetariańskie"],
        cuisine: ["Polska", "Gruzińska"],
        "source.title": ["Facetznożem"],
        "source.url": ["https://example.com"],
        "source.book": ["Książka kucharska"],
        "source.author": ["Autor"],
        "source.where": ["Warszawa"],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls fetchSummary when rendering the page", async () => {
        (fetchSummary as jest.Mock).mockResolvedValue({
            summary,
        });

        await SearchPage();

        expect(fetchSummary).toHaveBeenCalledTimes(1);
    });

    it("passes the fetched summary to SearchFilters", async () => {
        (fetchSummary as jest.Mock).mockResolvedValue({
            summary,
        });

        render(await SearchPage());

        expect(screen.getByTestId("search-filters-options")).toHaveTextContent(JSON.stringify(summary));
    });

    it("does not render SearchFilters when summary is unavailable", async () => {
        (fetchSummary as jest.Mock).mockResolvedValue({
            summary: null,
        });

        render(await SearchPage());

        expect(screen.queryByTestId("search-filters")).not.toBeInTheDocument();
    });
});
