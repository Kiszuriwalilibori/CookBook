// RecipeSource.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { RecipeSource } from "./RecipeSource";
import type { Recipe } from "@/lib/types";

// -----------------------------
//  Store typing for strict mode
// -----------------------------
interface AdminStore {
    isAdminLogged: boolean;
}

type Selector<T> = <U>(selector: (state: T) => U) => U;

// -----------------------------
//  MOCK: Zustand store (TDZ-safe)
// -----------------------------
jest.mock("@/stores/useAdminStore", () => ({
    useAdminStore: jest.fn(),
}));

import { useAdminStore } from "@/stores/useAdminStore";

const mockUseAdminStore = useAdminStore as unknown as jest.MockedFunction<Selector<AdminStore>>;

// -----------------------------
//  MOCK: MUI components
// -----------------------------
jest.mock("@mui/material", () => ({
    Box: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Typography: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
}));

// -----------------------------
//  MOCK: Styles
// -----------------------------
jest.mock("../styles", () => ({
    styles: {
        sourceContainer: {},
        sourceText: {},
    },
}));

// -----------------------------
//  Recipe factory (strict mode)
// -----------------------------
const createRecipe = (partial: Partial<Recipe>): Recipe => {
    const base = {
        _id: "1",
        title: "Test",
    };
    return { ...base, ...partial } as Recipe;
};

// -----------------------------
//  Test data
// -----------------------------
const mockRecipeNoSource = createRecipe({});

const mockRecipeWithHttp = createRecipe({
    source: {
        http: "https://example.com/recipe",
        title: "",
        book: "",
        author: "",
        where: "",
    },
});

const mockRecipeWithoutHttp = createRecipe({
    source: {
        http: "",
        title: "Tytuł Przepisu",
        author: "Jan Kowalski",
        book: "Książka Gotowania",
        where: "str. 123",
    },
});

const mockRecipeEmptySource = createRecipe({
    source: {
        http: "",
        title: "",
        book: "",
        author: "",
        where: "",
    },
});

// -----------------------------
//  Tests
// -----------------------------
describe("RecipeSource", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns null if admin is not logged in", () => {
        mockUseAdminStore.mockImplementation(selector => selector({ isAdminLogged: false }));

        const { container } = render(<RecipeSource recipe={mockRecipeWithHttp} />);
        expect(container.firstChild).toBeNull();
    });

    it("returns null when no source is provided", () => {
        mockUseAdminStore.mockImplementation(selector => selector({ isAdminLogged: true }));

        const { container } = render(<RecipeSource recipe={mockRecipeNoSource} />);
        expect(container.firstChild).toBeNull();
    });

    it("renders HTTP source", () => {
        mockUseAdminStore.mockImplementation(selector => selector({ isAdminLogged: true }));

        render(<RecipeSource recipe={mockRecipeWithHttp} />);

        expect(screen.getByText("Źródło: https://example.com/recipe")).toBeInTheDocument();
    });

    it("renders combined source when no valid HTTP exists", () => {
        mockUseAdminStore.mockImplementation(selector => selector({ isAdminLogged: true }));

        render(<RecipeSource recipe={mockRecipeWithoutHttp} />);

        expect(screen.getByText("Źródło: Tytuł Przepisu | autor: Jan Kowalski | książka: Książka Gotowania | gdzie: str. 123")).toBeInTheDocument();
    });

    it("returns null when source is empty", () => {
        mockUseAdminStore.mockImplementation(selector => selector({ isAdminLogged: true }));

        const { container } = render(<RecipeSource recipe={mockRecipeEmptySource} />);

        expect(container.firstChild).toBeNull();
    });

    it("handles whitespace in HTTP correctly", () => {
        const recipeWithWhitespace = createRecipe({
            source: {
                http: "  https://example.com/recipe  ",
                title: "",
                book: "",
                author: "",
                where: "",
            },
        });

        mockUseAdminStore.mockImplementation(selector => selector({ isAdminLogged: true }));

        render(<RecipeSource recipe={recipeWithWhitespace} />);

        // Whitespace collapses, so match without exact spacing
        expect(screen.getByText(text => text.includes("Źródło: https://example.com/recipe"))).toBeInTheDocument();
    });

    it("handles partial source fields", () => {
        const partial = createRecipe({
            source: {
                http: "",
                title: "Tytuł",
                book: "Książka",
                author: "",
                where: "",
            },
        });

        mockUseAdminStore.mockImplementation(selector => selector({ isAdminLogged: true }));

        render(<RecipeSource recipe={partial} />);

        expect(screen.getByText("Źródło: Tytuł | książka: Książka")).toBeInTheDocument();
    });
});
