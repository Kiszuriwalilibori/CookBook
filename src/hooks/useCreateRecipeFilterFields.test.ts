import { useCreateRecipeFilterFields } from "./useCreateRecipeFilterFields";
import { RecipeFilter } from "@/types";
import { renderHook } from "@testing-library/react";

describe("useCreateRecipeFilterFields", () => {
    it("should return all base filter fields with correct structure", () => {
        const mockOptions: RecipeFilter = {
            title: ["pasta", "salad"],
            cuisine: ["Italian", "Thai"],
            tags: ["quick", "easy"],
            dietary: ["vegan", "gluten-free"],
            products: ["flour", "oil"],
            "source.http": ["https://example.com"],
            "source.book": ["cookbook"],
            "source.title": ["recipe title"],
            "source.author": ["author"],
            "source.where": ["kitchen"],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        expect(result.current).toHaveLength(11);
        expect(result.current[0].key).toBe("title");
        expect(result.current[1].key).toBe("cuisine");
        expect(result.current[2].key).toBe("tags");
        expect(result.current[10].key).toBe("source.where");
    });

    it("should populate autocomplete options from provided options", () => {
        const mockOptions: RecipeFilter = {
            title: ["pasta", "pizza"],
            cuisine: ["Italian"],
            tags: ["quick"],
            dietary: [],
            products: ["cheese"],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        const titleField = result.current.find(f => f.key === "title");
        const cuisineField = result.current.find(f => f.key === "cuisine");
        const tagsField = result.current.find(f => f.key === "tags");

        expect(titleField?.options).toEqual(["pasta", "pizza"]);
        expect(cuisineField?.options).toEqual(["Italian"]);
        expect(tagsField?.options).toEqual(["quick"]);
    });

    it("should not populate options for switch component", () => {
        const mockOptions: RecipeFilter = {
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        const kiziaField = result.current.find(f => f.key === "kizia");
        expect(kiziaField?.component).toBe("switch");
        expect(kiziaField?.options).toEqual([]);
    });

    it("should sanitize invalid options (non-string or empty values)", () => {
        const mockOptions = {
            title: ["pasta", "", null, "pizza", undefined],
            cuisine: [],
            tags: ["quick"],
            dietary: [],
            products: [],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        } as RecipeFilter;

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        const titleField = result.current.find(f => f.key === "title");
        expect(titleField?.options).toEqual(["pasta", "pizza"]);
    });

    it("should include all required field properties", () => {
        const mockOptions: RecipeFilter = {
            title: ["test"],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        result.current.forEach(field => {
            expect(field).toHaveProperty("key");
            expect(field).toHaveProperty("label");
            expect(field).toHaveProperty("multiple");
            expect(field).toHaveProperty("options");
            expect(field).toHaveProperty("placeholder");
            expect(field).toHaveProperty("requiredAdmin");
            expect(field).toHaveProperty("component");
        });
    });

    it("should have correct multiple flag for each field", () => {
        const mockOptions: RecipeFilter = {
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        const singleFields = result.current.filter(f => !f.multiple);
        const multipleFields = result.current.filter(f => f.multiple);

        expect(singleFields.map(f => f.key)).toEqual(["title", "cuisine", "kizia", "source.http", "source.book", "source.title", "source.author", "source.where"]);
        expect(multipleFields.map(f => f.key)).toEqual(["tags", "dietary", "products"]);
    });

    it("should have chips enabled for array fields", () => {
        const mockOptions: RecipeFilter = {
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        const tagsField = result.current.find(f => f.key === "tags");
        const dietaryField = result.current.find(f => f.key === "dietary");
        const productsField = result.current.find(f => f.key === "products");
        const titleField = result.current.find(f => f.key === "title");

        expect(tagsField?.chips).toBe(true);
        expect(dietaryField?.chips).toBe(true);
        expect(productsField?.chips).toBe(true);
        expect(titleField?.chips).toBeUndefined();
    });

    it("should mark admin-required fields correctly", () => {
        const mockOptions: RecipeFilter = {
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        const adminFields = result.current.filter(f => f.requiredAdmin);
        expect(adminFields.map(f => f.key)).toEqual(["kizia", "source.http", "source.book", "source.title", "source.author", "source.where"]);
    });

    it("should handle empty options object", () => {
        const mockOptions: RecipeFilter = {
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        expect(result.current).toHaveLength(11);
        result.current.forEach(field => {
            if (field.component === "autocomplete") {
                expect(field.options).toEqual([]);
            }
        });
    });

    it("should return correct placeholder for dietary field", () => {
        const mockOptions: RecipeFilter = {
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        const dietaryField = result.current.find(f => f.key === "dietary");
        expect(dietaryField?.placeholder).toBe("Bez ograniczeń");
    });

    it("should have link placeholder for source.http field", () => {
        const mockOptions: RecipeFilter = {
            title: [],
            cuisine: [],
            tags: [],
            dietary: [],
            products: [],
            "source.http": [],
            "source.book": [],
            "source.title": [],
            "source.author": [],
            "source.where": [],
        };

        const { result } = renderHook(() => useCreateRecipeFilterFields(mockOptions));

        const httpField = result.current.find(f => f.key === "source.http");
        expect(httpField?.placeholder).toBe("Link");
    });
});
