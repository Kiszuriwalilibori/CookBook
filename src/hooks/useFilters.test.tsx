/*
TESTY HOOKA useFilters – AUTOMATYCZNY ZAPIS FILTRÓW

1. Sprawdzamy inicjalizację filtrów, automatyczne przekazywanie zmian
   stanu do callbacku oraz poprawne działanie funkcji clear() i apply().
*/
import { act, renderHook, waitFor } from "@testing-library/react";

import { useFilters, initialFilters } from "./useFilters";

import type { RecipeFilter } from "@/types";

describe("useFilters – automatyczny zapis filtrów", () => {
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

    it("inicjalizuje filtry wartościami początkowymi i przekazuje je do callbacku", async () => {
        const onFiltersChange = jest.fn();

        const { result } = renderHook(() => useFilters(options, onFiltersChange));

        expect(result.current.filters).toEqual(initialFilters);

        await waitFor(() => {
            expect(onFiltersChange).toHaveBeenCalledWith(initialFilters);
        });
    });

    it("automatycznie przekazuje do callbacku zmieniony stan filtrów bez wywoływania apply()", async () => {
        const onFiltersChange = jest.fn();

        const { result } = renderHook(() => useFilters(options, onFiltersChange));

        await waitFor(() => {
            expect(onFiltersChange).toHaveBeenCalled();
        });

        onFiltersChange.mockClear();

        act(() => {
            result.current.handleChange("title", "Test");
        });

        await waitFor(() => {
            expect(onFiltersChange).toHaveBeenLastCalledWith({
                ...initialFilters,
                title: "test",
            });
        });
    });

    it("przywraca początkowe filtry i przekazuje je do callbacku po wywołaniu clear()", async () => {
        const onFiltersChange = jest.fn();

        const { result } = renderHook(() => useFilters(options, onFiltersChange));

        await waitFor(() => {
            expect(onFiltersChange).toHaveBeenCalled();
        });

        act(() => {
            result.current.handleChange("title", "Test");
        });

        act(() => {
            result.current.clear();
        });

        expect(result.current.filters).toEqual(initialFilters);

        expect(onFiltersChange).toHaveBeenLastCalledWith(initialFilters);
    });

    it("przekazuje aktualny stan filtrów do callbacku po wywołaniu apply()", async () => {
        const onFiltersChange = jest.fn();

        const { result } = renderHook(() => useFilters(options, onFiltersChange));

        await waitFor(() => {
            expect(onFiltersChange).toHaveBeenCalled();
        });

        act(() => {
            result.current.handleChange("title", "Test");
        });

        let applyResult: boolean | undefined;

        act(() => {
            applyResult = result.current.apply();
        });

        expect(applyResult).toBe(true);

        expect(onFiltersChange).toHaveBeenLastCalledWith({
            ...initialFilters,
            title: "test",
        });
    });
});
