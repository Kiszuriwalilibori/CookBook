// RecipeFilters.test.tsx

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecipeFilters from "./RecipeFilters"; // adjust the path if needed
import { useRouter } from "next/navigation";
import { searchRecipeByTitle } from "@/lib/searchRecipeByTitle";
import { useFiltersStore } from "@/stores";
import { useFilters } from "@/hooks";

// Mock the external functions
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/lib/searchRecipeByTitle", () => ({
    searchRecipeByTitle: jest.fn(),
}));

jest.mock("@/stores", () => ({
    useFiltersStore: jest.fn(),
}));

jest.mock("@/hooks", () => ({
    useFilters: jest.fn(),
}));


describe("RecipeFilters", () => {
    const mockOnFiltersChange = jest.fn();
    const mockRouterPush = jest.fn();

    beforeEach(() => {
        // Mock the useRouter hook
        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
        });

        // Mock useFiltersStore and useFilters
        (useFiltersStore as unknown as jest.Mock).mockReturnValue({
            filters: { title: "", cuisine: "", tags: [], dietary: [], products: [] },
            errors: {},
            setFilters: jest.fn(),
        });

        (useFilters as jest.Mock).mockReturnValue({
            filters: {
                title: "",
                cuisine: "",
                tags: [],
                dietary: [],
                products: [],
            },
            errors: {},
            handleChange: jest.fn(),
            clear: jest.fn(),
            apply: jest.fn().mockReturnValue(true),
        });
    });

    it("renders the component with filter fields", () => {
        render(<RecipeFilters onFiltersChange={mockOnFiltersChange} options={{ title: [], cuisine: [], tags: [], dietary: [], products: [] }} />);

        // Check if filter fields are rendered
        expect(screen.getByLabelText("Title")).toBeInTheDocument();
        expect(screen.getByLabelText("Cuisine")).toBeInTheDocument();
        expect(screen.getByLabelText("Tags")).toBeInTheDocument();
        expect(screen.getByLabelText("Dietary")).toBeInTheDocument();
        expect(screen.getByLabelText("Products")).toBeInTheDocument();
    });

    it("handles input changes and updates filters", async () => {
        render(<RecipeFilters onFiltersChange={mockOnFiltersChange} options={{ title: [], cuisine: [], tags: [], dietary: [], products: [] }} />);

        const titleInput = screen.getByLabelText("Title");
        userEvent.type(titleInput, "Pasta");

        // Simulate applying filters
        const applyButton = screen.getByText("Zastosuj");
        userEvent.click(applyButton);

        await waitFor(() => {
            // Check if onFiltersChange was called
            expect(mockOnFiltersChange).toHaveBeenCalledWith({
                title: "pasta",
                cuisine: "",
                tags: [],
                dietary: [],
                products: [],
            });
        });
    });

    it("clears filters when 'Wyczyść' button is clicked", () => {
        render(<RecipeFilters onFiltersChange={mockOnFiltersChange} options={{ title: [], cuisine: [], tags: [], dietary: [], products: [] }} />);

        const clearButton = screen.getByText("Wyczyść");
        userEvent.click(clearButton);

        // Check if filters were cleared
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            title: "",
            cuisine: "",
            tags: [],
            dietary: [],
            products: [],
        });
    });

    it("navigates to the recipe detail when a title filter is applied", async () => {
        // Mock searchRecipeByTitle to return a slug
        (searchRecipeByTitle as jest.Mock).mockResolvedValue("pasta-recipe");

        render(<RecipeFilters onFiltersChange={mockOnFiltersChange} options={{ title: [], cuisine: [], tags: [], dietary: [], products: [] }} />);

        // Simulate input and apply
        const titleInput = screen.getByLabelText("Title");
        userEvent.type(titleInput, "Pasta");

        const applyButton = screen.getByText("Zastosuj");
        userEvent.click(applyButton);

        await waitFor(() => {
            // Check if the router push was called with the correct URL
            expect(mockRouterPush).toHaveBeenCalledWith("/recipes/pasta-recipe");
        });
    });

    it("shows an error when tags exceed the maximum limit", () => {
        render(<RecipeFilters onFiltersChange={mockOnFiltersChange} options={{ title: [], cuisine: [], tags: [], dietary: [], products: [] }} />);

        const tagsInput = screen.getByLabelText("Tags");
        userEvent.type(tagsInput, "Tag 1, Tag 2, Tag 3, Tag 4, Tag 5, Tag 6, Tag 7, Tag 8, Tag 9, Tag 10, Tag 11");

        const applyButton = screen.getByText("Zastosuj");
        userEvent.click(applyButton);

        expect(screen.getByText("Maksymalnie 10 tagów")).toBeInTheDocument();
    });
});
