/*
 * Testy sprawdzają:
 * - wyświetlanie EmptyState, gdy aktywne filtry nie zwracają przepisów,
 * - wyświetlanie domyślnego komunikatu, gdy nie ma przepisów i aktywnych filtrów,
 * - wyświetlanie EmptyState w przypadku błędu pobierania przepisów,
 * - zapisywanie aktualnego URL strony przepisów wraz z parametrami query string w LastRecipes.
 */
import { afterEach, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import RecipesClient from "./RecipesClient";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { LastRecipes } from "@/utils/LastRecipes";

jest.mock("@/components", () => ({
    PageTitle: () => null,
}));

jest.mock("@/components/EmptyState", () => ({
    EmptyState: () => <div data-testid="empty-state" />,
}));

jest.mock("./effects", () => ({
    useHydrateSSR: jest.fn(),
    useNonAdminRefetch: jest.fn(),
    useAdminRefetch: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock("@/components/RecipeCard/RecipeCard", () => ({
    RecipeCard: () => null,
}));

jest.mock("@/utils/LastRecipes", () => ({
    LastRecipes: {
        save: jest.fn(),
        get: jest.fn(),
        clear: jest.fn(),
    },
}));

describe("RecipesClient", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useFavoritesStore.getState().reset();
    });

    afterEach(() => {
        window.history.replaceState({}, "", "/");
    });

    it("renders EmptyState when active filters return no recipes", () => {
        render(<RecipesClient initialRecipes={[]} initialFavorites={[]} hasActiveFilters={true} recipesError={false} />);

        expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("renders the default empty message when there are no active filters", () => {
        render(<RecipesClient initialRecipes={[]} initialFavorites={[]} hasActiveFilters={false} recipesError={false} />);

        expect(screen.getByText("Brak przepisów do wyświetlenia.")).toBeInTheDocument();
        expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
    });

    it("renders EmptyState when loading recipes fails", () => {
        render(<RecipesClient initialRecipes={[]} initialFavorites={[]} hasActiveFilters={true} recipesError={true} />);

        expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("saves the current recipes URL including query parameters", () => {
        window.history.replaceState({}, "", "/recipes?tags=vegetarian&cuisine=italian");

        render(<RecipesClient initialRecipes={[]} initialFavorites={[]} hasActiveFilters={true} recipesError={false} />);

        expect(LastRecipes.save).toHaveBeenCalledWith("/recipes?tags=vegetarian&cuisine=italian");
    });
});
