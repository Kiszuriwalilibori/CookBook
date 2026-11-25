/*
TESTY KOMPONENTU SearchFilters

1. Sprawdzamy, czy komponent SearchFilters poprawnie renderuje RecipeFilters.

2. Sprawdzamy, czy do RecipeFilters przekazywane są opcje filtrów
   otrzymane przez SearchFilters.

3. Sprawdzamy, czy do RecipeFilters przekazywane są wartości początkowe
   filtrów (initialValues).

4. Sprawdzamy, czy do RecipeFilters przekazywany jest callback
   onFiltersChange odpowiedzialny za obsługę zmian filtrów i ich zapis.

5. Sprawdzamy, czy komponent nie przekazuje zbędnych propsów.
*/

import { render, screen } from "@testing-library/react";

import SearchFilters from "./SearchFilters";

import type { RecipeFilter } from "@/types";

const mockRecipeFilters = jest.fn();

jest.mock("@/components", () => ({
    RecipeFilters: (props: { options: RecipeFilter }) => {
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

    it("passes the expected props to RecipeFilters", () => {
        render(<SearchFilters options={options} />);

        const props = mockRecipeFilters.mock.calls[0][0];

        expect(props).toEqual({
            options,
            initialValues: expect.any(Object),
            onFiltersChange: expect.any(Function),
        });
    });
});
