/*
 * Testy sprawdzają:
 * - domyślny adres /recipes pozycji „Przepisy”, gdy brak zapamiętanego URL,
 * - dynamiczną aktualizację href pozycji „Przepisy” po zmianie store'a,
 * - wywołanie ręcznej hydratacji store'a po zamontowaniu hooka useNavItems.
 */

import { act, renderHook } from "@testing-library/react";

import { useNavItems } from "./useNavItems";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useLastRecipesStore } from "@/stores/useLastRecipesStore";

describe("useNavItems", () => {
    beforeEach(() => {
        sessionStorage.clear();

        useLastRecipesStore.setState({
            lastRecipesUrl: null,
        });

        sessionStorage.clear();
        useFavoritesStore.getState().reset();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("uses /recipes as the default href when no URL is saved", () => {
        const { result } = renderHook(() => useNavItems());

        const recipesItem = result.current.find(item => item.label === "Przepisy");

        expect(recipesItem?.href).toBe("/recipes");
    });

    it("updates the recipes href when the stored URL changes", () => {
        const { result } = renderHook(() => useNavItems());

        act(() => {
            useLastRecipesStore.getState().setLastRecipesUrl("/recipes/example-recipe");
        });

        const recipesItem = result.current.find(item => item.label === "Przepisy");

        expect(recipesItem?.href).toBe("/recipes/example-recipe");
    });

    it("rehydrates the last recipes store after mounting", () => {
        const rehydrateSpy = jest.spyOn(useLastRecipesStore.persist, "rehydrate");

        renderHook(() => useNavItems());

        expect(rehydrateSpy).toHaveBeenCalledTimes(1);
    });
});
