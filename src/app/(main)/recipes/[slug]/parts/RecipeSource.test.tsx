// RecipeSource.test.tsx
import { render, screen } from "@testing-library/react";
import { RecipeSource } from "./RecipeSource"; // Dostosuj ścieżkę do Twojego pliku
import { Recipe } from "@/lib/types"; // Załóż, że masz typy

// Mock Zustand store z typami (uproszczony, bez generyków na fn dla uniknięcia parse errors)
interface AdminStoreState {
    isAdminLogged: boolean;
    // Dodaj inne pola stanu, jeśli potrzebne
}

// IMPORTANT: Declare the mock FUNCTION before jest.mock() to avoid TDZ error
const mockUseAdminStore = jest.fn();

jest.mock("@/stores/useAdminStore", () => ({
    useAdminStore: mockUseAdminStore,
}));

// Mock MUI styles (proste, bo to obiekt)
jest.mock("../styles", () => ({
    styles: {
        sourceContainer: {
            /* mock styles */
        },
        sourceText: {
            /* mock styles */
        },
    },
}));

// Mock typ Recipe (z '_id' wymagany) – dodaj inne required pola z types.ts jeśli potrzeba
const mockRecipeNoSource: Recipe = { _id: "1", title: "Test" /* inne pola */ };
const mockRecipeWithHttp: Recipe = {
    ...mockRecipeNoSource,
    source: { http: "https://example.com/recipe", title: "", book: "", author: "", where: "" },
};
const mockRecipeWithoutHttp: Recipe = {
    ...mockRecipeNoSource,
    source: {
        http: "",
        title: "Tytuł Przepisu",
        author: "Jan Kowalski",
        book: "Książka Gotowania",
        where: "str. 123",
    },
};
const mockRecipeEmptySource: Recipe = {
    ...mockRecipeNoSource,
    source: { http: "", title: "", book: "", author: "", where: "" },
};

describe("RecipeSource", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return null if admin is not logged in", () => {
        mockUseAdminStore.mockImplementation((selector: (state: AdminStoreState) => boolean) => selector({ isAdminLogged: false }));

        const { container } = render(<RecipeSource recipe={mockRecipeWithHttp} />);

        expect(container.firstChild).toBeNull();
    });

    it("should return null if no source provided", () => {
        mockUseAdminStore.mockImplementation((selector: (state: AdminStoreState) => boolean) => selector({ isAdminLogged: true }));

        const { container } = render(<RecipeSource recipe={mockRecipeNoSource} />);

        expect(container.firstChild).toBeNull();
    });

    it("should render HTTP source when valid HTTP is provided", () => {
        mockUseAdminStore.mockImplementation((selector: (state: AdminStoreState) => boolean) => selector({ isAdminLogged: true }));

        render(<RecipeSource recipe={mockRecipeWithHttp} />);

        expect(screen.getByText("Źródło: https://example.com/recipe")).toBeInTheDocument();
    });

    it("should render combined source text when no valid HTTP but other fields present", () => {
        mockUseAdminStore.mockImplementation((selector: (state: AdminStoreState) => boolean) => selector({ isAdminLogged: true }));

        render(<RecipeSource recipe={mockRecipeWithoutHttp} />);

        const expectedText = "Źródło: Tytuł Przepisu | autor: Jan Kowalski | książka: Książka Gotowania | gdzie: str. 123";
        expect(screen.getByText(expectedText)).toBeInTheDocument();
    });

    it("should return null if no valid HTTP and no other fields", () => {
        mockUseAdminStore.mockImplementation((selector: (state: AdminStoreState) => boolean) => selector({ isAdminLogged: true }));

        const { container } = render(<RecipeSource recipe={mockRecipeEmptySource} />);

        expect(container.firstChild).toBeNull();
    });

    it("should trim whitespace in HTTP check", () => {
        const recipeWithWhitespaceHttp: Recipe = {
            ...mockRecipeNoSource,
            source: { http: "  https://example.com/recipe  ", title: "", book: "", author: "", where: "" },
        };

        mockUseAdminStore.mockImplementation((selector: (state: AdminStoreState) => boolean) => selector({ isAdminLogged: true }));

        render(<RecipeSource recipe={recipeWithWhitespaceHttp} />);

        // Komponent trimuje tylko do checku, display pokazuje oryginalny (z whitespace)
        expect(screen.getByText("Źródło:   https://example.com/recipe  ")).toBeInTheDocument();
    });

    it("should handle empty strings in other fields correctly", () => {
        const recipePartial: Recipe = {
            ...mockRecipeNoSource,
            source: { http: "", title: "Tytuł", author: "", book: "Książka", where: "" },
        };

        mockUseAdminStore.mockImplementation((selector: (state: AdminStoreState) => boolean) => selector({ isAdminLogged: true }));

        render(<RecipeSource recipe={recipePartial} />);

        const expectedText = "Źródło: Tytuł | książka: Książka";
        expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
});
