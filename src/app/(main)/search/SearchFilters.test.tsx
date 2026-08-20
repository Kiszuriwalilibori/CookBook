/**
 * SearchFilters renderuje formularz filtrowania przepisów.
 *
 * SearchFilters przekazuje otrzymane opcje do RecipeFilters.
 *
 * SearchFilters przekazuje funkcję onFiltersChange do RecipeFilters.
 */

import { render, screen } from "@testing-library/react";

import SearchFilters from "./SearchFilters";

import type { RecipeFilter } from "@/types";

const mockRecipeFilters = jest.fn();

jest.mock("@/components", () => ({
    RecipeFilters: (props: { onFiltersChange: () => void; options: RecipeFilter }) => {
        mockRecipeFilters(props);

        return <div data-testid="recipe-filters">RecipeFilters</div>;
    },
}));

describe("SearchFilters", () => {
    const options: RecipeFilter = {
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
        mockRecipeFilters.mockClear();
    });

    it("renders the recipe filters", () => {
        render(<SearchFilters options={options} />);

        expect(screen.getByTestId("recipe-filters")).toBeInTheDocument();
    });

    it("passes the provided options to RecipeFilters", () => {
        render(<SearchFilters options={options} />);

        expect(mockRecipeFilters).toHaveBeenCalledWith(
            expect.objectContaining({
                options,
            })
        );
    });

    it("passes onFiltersChange to RecipeFilters", () => {
        render(<SearchFilters options={options} />);

        expect(mockRecipeFilters).toHaveBeenCalledWith(
            expect.objectContaining({
                onFiltersChange: expect.any(Function),
            })
        );
    });
});
