/*
 * Testy sprawdzają:
 * - inicjalizację store'a z wartością lastRecipesUrl równą null,
 * - zapisywanie zmienionego URL w sessionStorage,
 * - odtwarzanie zapisanego URL po ręcznym wywołaniu rehydrate(),
 * - brak automatycznej hydratacji przy skipHydration,
 * - czyszczenie zapamiętanego URL.
 */

import { act } from "@testing-library/react";

import { useLastRecipesStore } from "./useLastRecipesStore";

const STORAGE_KEY = "last-recipes-store";

describe("useLastRecipesStore", () => {
    beforeEach(() => {
        sessionStorage.clear();

        useLastRecipesStore.setState({
            lastRecipesUrl: null,
        });

        sessionStorage.clear();
    });

    it("initializes with a null lastRecipesUrl", () => {
        expect(useLastRecipesStore.getState().lastRecipesUrl).toBeNull();
    });

    it("persists the last recipes URL in sessionStorage", () => {
        const url = "/recipes?tags=vegetarian";

        act(() => {
            useLastRecipesStore.getState().setLastRecipesUrl(url);
        });

        const storedValue = sessionStorage.getItem(STORAGE_KEY);

        expect(storedValue).not.toBeNull();
        expect(JSON.parse(storedValue!).state.lastRecipesUrl).toBe(url);
    });

    it("restores the last recipes URL after manual rehydration", async () => {
        const url = "/recipes/example-recipe";

        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                state: {
                    lastRecipesUrl: url,
                },
                version: 0,
            })
        );

        expect(useLastRecipesStore.getState().lastRecipesUrl).toBeNull();

        await act(async () => {
            await useLastRecipesStore.persist.rehydrate();
        });

        expect(useLastRecipesStore.getState().lastRecipesUrl).toBe(url);
    });

    it("clears the last recipes URL", () => {
        act(() => {
            useLastRecipesStore.getState().setLastRecipesUrl("/recipes/example-recipe");
        });

        act(() => {
            useLastRecipesStore.getState().setLastRecipesUrl(null);
        });

        expect(useLastRecipesStore.getState().lastRecipesUrl).toBeNull();

        const storedValue = sessionStorage.getItem(STORAGE_KEY);

        expect(JSON.parse(storedValue!).state.lastRecipesUrl).toBeNull();
    });
});
