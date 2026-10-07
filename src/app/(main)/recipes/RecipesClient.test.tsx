import { render, screen } from "@testing-library/react";
import RecipesClient from "./RecipesClient";
import { useFavoritesStore } from "@/stores/useFavoritesStore";

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

describe("RecipesClient empty states", () => {
    beforeEach(() => {
        useFavoritesStore.getState().reset();
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
});
