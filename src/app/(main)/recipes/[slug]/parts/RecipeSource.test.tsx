import { render, screen } from "@testing-library/react";
import { RecipeSource } from "./RecipeSource";
import { Recipe, Status } from "@/types";

// Mockujemy cały moduł store z named exportami
jest.mock("@/stores/useAdminStore", () => ({
    useIsAdminLogged: jest.fn(),
}));

import { useIsAdminLogged } from "@/stores/useAdminStore";
const mockedUseIsAdminLogged = useIsAdminLogged as jest.MockedFunction<typeof useIsAdminLogged>;

describe("RecipeSource", () => {
    const baseRecipe: Recipe = {
        _id: "test-id",
        _createdAt: "2024-01-01T00:00:00Z",
        _updatedAt: "2024-01-01T00:00:00Z",
        title: "Test Recipe",
        status: Status.Good,
        source: undefined,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns null if admin is not logged in", () => {
        mockedUseIsAdminLogged.mockReturnValue(false);

        const { container } = render(
            <RecipeSource
                recipe={{
                    ...baseRecipe,
                    source: { url: "http://example.com" },
                }}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it("returns null when no source is provided", () => {
        mockedUseIsAdminLogged.mockReturnValue(true);

        const { container } = render(<RecipeSource recipe={baseRecipe} />);

        expect(container.firstChild).toBeNull();
    });

    it("renders HTTP source", () => {
        mockedUseIsAdminLogged.mockReturnValue(true);

        render(
            <RecipeSource
                recipe={{
                    ...baseRecipe,
                    source: { url: "http://example.com" },
                }}
            />
        );

        expect(screen.getByText("Źródło: http://example.com")).toBeInTheDocument();
    });

    it("renders combined source when no valid HTTP exists", () => {
        mockedUseIsAdminLogged.mockReturnValue(true);

        render(
            <RecipeSource
                recipe={{
                    ...baseRecipe,
                    source: {
                        url: "",
                        title: "Grandma's Book",
                        book: "Cookbook",
                        author: "Anna",
                        where: "Kitchen",
                    },
                }}
            />
        );

        expect(screen.getByText("Źródło: Grandma's Book | autor: Anna | książka: Cookbook | gdzie: Kitchen")).toBeInTheDocument();
    });

    it("returns null when source is empty", () => {
        mockedUseIsAdminLogged.mockReturnValue(true);

        const { container } = render(
            <RecipeSource
                recipe={{
                    ...baseRecipe,
                    source: {
                        url: "",
                        title: "",
                        book: "",
                        author: "",
                        where: "",
                    },
                }}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it("handles whitespace in HTTP correctly", () => {
        mockedUseIsAdminLogged.mockReturnValue(true);

        // url: "   " -> trim() === "" -> hasValidURL = false
        // Wszystkie pozostałe pola puste -> parts.length === 0 -> return null
        const { container } = render(
            <RecipeSource
                recipe={{
                    ...baseRecipe,
                    source: {
                        url: "   ",
                        title: "",
                        book: "",
                        author: "",
                        where: "",
                    },
                }}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it("handles partial source fields", () => {
        mockedUseIsAdminLogged.mockReturnValue(true);

        render(
            <RecipeSource
                recipe={{
                    ...baseRecipe,
                    source: {
                        url: "",
                        title: "Title Only",
                        book: "",
                        author: "",
                        where: "",
                    },
                }}
            />
        );

        expect(screen.getByText("Źródło: Title Only")).toBeInTheDocument();
    });
});
