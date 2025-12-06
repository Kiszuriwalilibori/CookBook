import { renderHook, act } from "@testing-library/react";
import { useFiltersStore } from "./useFiltersStore";
import { EMPTY_RECIPE_FILTER } from "@/types";
import { initialFilters } from "@/hooks/useFilters";

describe("useFiltersStore", () => {
    beforeEach(() => {
        useFiltersStore.setState({
            filters: initialFilters,
            errors: {},
            options: EMPTY_RECIPE_FILTER,
        });
    });

    describe("initialization", () => {
        it("should initialize with default filters and empty errors", () => {
            const { result } = renderHook(() => useFiltersStore());

            expect(result.current.filters).toEqual(initialFilters);
            expect(result.current.errors).toEqual({});
            expect(result.current.options).toEqual(EMPTY_RECIPE_FILTER);
        });
    });

    describe("handleChange", () => {
        it("should update string field value", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "pasta");
            });

            expect(result.current.filters.title).toBe("pasta");
        });

        it("should update array field value", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("tags", ["quick", "easy"]);
            });

            expect(result.current.filters.tags).toEqual(["quick", "easy"]);
        });

        it("should set error for string longer than 50 characters", () => {
            const { result } = renderHook(() => useFiltersStore());
            const longString = "a".repeat(51);

            act(() => {
                result.current.handleChange("title", longString);
            });

            expect(result.current.errors.title).toBe("Maks. 50 znaków");
        });

        it("should not set error for string within 50 characters", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "valid title");
            });

            expect(result.current.errors.title).toBeUndefined();
        });

        it("should truncate array to max 10 elements and set error", () => {
            const { result } = renderHook(() => useFiltersStore());
            const longArray = Array.from({ length: 15 }, (_, i) => `item${i}`);

            act(() => {
                result.current.handleChange("tags", longArray);
            });

            expect(result.current.filters.tags).toHaveLength(10);
            expect(result.current.errors.tags).toBe("Maks. 10 elementów");
        });

        it("should allow array with exactly 10 elements without error", () => {
            const { result } = renderHook(() => useFiltersStore());
            const tenItems = Array.from({ length: 10 }, (_, i) => `item${i}`);

            act(() => {
                result.current.handleChange("tags", tenItems);
            });

            expect(result.current.filters.tags).toEqual(tenItems);
            expect(result.current.errors.tags).toBeUndefined();
        });

        it("should clear error when valid value is set after invalid", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "a".repeat(51));
            });

            expect(result.current.errors.title).toBe("Maks. 50 znaków");

            act(() => {
                result.current.handleChange("title", "valid");
            });

            expect(result.current.errors.title).toBeUndefined();
        });

        it("should handle boolean field (kizia)", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("kizia", true);
            });

            expect(result.current.filters.kizia).toBe(true);
        });

        it("should preserve other filters when changing one", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "pasta");
                result.current.handleChange("cuisine", "italian");
            });

            expect(result.current.filters.title).toBe("pasta");
            expect(result.current.filters.cuisine).toBe("italian");
        });
    });

    describe("clear", () => {
        it("should reset all filters to initial state", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "pasta");
                result.current.handleChange("tags", ["quick"]);
            });

            act(() => {
                result.current.clear();
            });

            expect(result.current.filters).toEqual(initialFilters);
            expect(result.current.errors).toEqual({});
        });

        it("should clear all errors", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "a".repeat(51));
            });

            expect(result.current.errors).not.toEqual({});

            act(() => {
                result.current.clear();
            });

            expect(result.current.errors).toEqual({});
        });
    });

    describe("apply", () => {
        it("should return true when no errors", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "valid");
            });

            const valid = result.current.apply();
            expect(valid).toBe(true);
        });

        it("should return false when errors exist", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "a".repeat(51));
            });

            const valid = result.current.apply();
            expect(valid).toBe(false);
        });

        it("should return false when multiple errors exist", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "a".repeat(51));
                result.current.handleChange("tags", Array(15).fill("item"));
            });

            const valid = result.current.apply();
            expect(valid).toBe(false);
        });
    });

    describe("setFilters", () => {
        it("should set partial filters", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.setFilters({ title: "pasta", cuisine: "italian" });
            });

            expect(result.current.filters.title).toBe("pasta");
            expect(result.current.filters.cuisine).toBe("italian");
            expect(result.current.filters.tags).toEqual(initialFilters.tags);
        });

        it("should clear errors when setting filters", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "a".repeat(51));
            });

            expect(result.current.errors.title).toBe("Maks. 50 znaków");

            act(() => {
                result.current.setFilters({ title: "valid" });
            });

            expect(result.current.errors).toEqual({});
        });

        it("should preserve previous filters not in the partial update", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.setFilters({ title: "pasta" });
            });

            const titleValue = result.current.filters.title;

            act(() => {
                result.current.setFilters({ cuisine: "italian" });
            });

            expect(result.current.filters.title).toBe(titleValue);
            expect(result.current.filters.cuisine).toBe("italian");
        });
    });

    describe("initOptions", () => {
        it("should initialize options", () => {
            const { result } = renderHook(() => useFiltersStore());

            const newOptions = {
                title: ["pasta", "pizza"],
                cuisine: ["italian"],
                tags: ["quick"],
                dietary: ["vegan"],
                products: ["cheese"],
                "source.http": [],
                "source.book": [],
                "source.title": [],
                "source.author": [],
                "source.where": [],
            };

            act(() => {
                result.current.initOptions(newOptions);
            });

            expect(result.current.options).toEqual(newOptions);
        });

        it("should fill missing keys with empty recipe filter defaults", () => {
            const { result } = renderHook(() => useFiltersStore());

            const partialOptions = {
                title: ["pasta"],
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

            act(() => {
                result.current.initOptions(partialOptions);
            });

            expect(result.current.options.title).toEqual(["pasta"]);
        });
    });

    describe("complex scenarios", () => {
        it("should handle multiple operations in sequence", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "pasta");
                result.current.handleChange("cuisine", "italian");
                result.current.handleChange("tags", ["quick", "easy"]);
            });

            expect(result.current.filters.title).toBe("pasta");
            expect(result.current.filters.cuisine).toBe("italian");
            expect(result.current.filters.tags).toEqual(["quick", "easy"]);

            act(() => {
                result.current.clear();
            });

            expect(result.current.filters).toEqual(initialFilters);
        });

        it("should maintain state consistency across multiple calls", () => {
            const { result } = renderHook(() => useFiltersStore());

            act(() => {
                result.current.handleChange("title", "pasta");
            });

            const filters1 = result.current.filters;

            act(() => {
                result.current.handleChange("cuisine", "italian");
            });

            const filters2 = result.current.filters;

            expect(filters2.title).toBe("pasta");
            expect(filters2.cuisine).toBe("italian");
            expect(filters1.title).toBe(filters2.title);
        });
    });
});
