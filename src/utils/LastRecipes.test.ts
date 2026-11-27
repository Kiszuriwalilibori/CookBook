/*
 * Testy sprawdzają:
 * - zapisywanie względnych adresów URL sekcji przepisów,
 * - zapisywanie pełnych adresów URL z własnej domeny,
 * - zachowanie parametrów query string,
 * - odrzucanie adresów URL z obcej domeny,
 * - odrzucanie ścieżek spoza sekcji przepisów,
 * - zwracanie zapisanego URL przez get(),
 * - czyszczenie zapisanego URL przez clear().
 */

import { LastRecipes } from "./LastRecipes";
import { useLastRecipesStore } from "@/stores/useLastRecipesStore";

describe("LastRecipes", () => {
    beforeEach(() => {
        useLastRecipesStore.setState({
            lastRecipesUrl: null,
        });
    });

    it("saves a relative recipes URL", () => {
        LastRecipes.save("/recipes?tags=vegetarian");

        expect(useLastRecipesStore.getState().lastRecipesUrl).toBe("/recipes?tags=vegetarian");
    });

    it("saves an absolute URL from the current origin as a relative URL", () => {
        LastRecipes.save(`${window.location.origin}/recipes/example-recipe`);

        expect(useLastRecipesStore.getState().lastRecipesUrl).toBe("/recipes/example-recipe");
    });

    it("preserves query parameters when saving a URL", () => {
        LastRecipes.save("/recipes?tags=vegetarian&cuisine=italian");

        expect(LastRecipes.get()).toBe("/recipes?tags=vegetarian&cuisine=italian");
    });

    it("does not save a URL from another origin", () => {
        LastRecipes.save("https://example.com/recipes/example-recipe");

        expect(LastRecipes.get()).toBeNull();
    });

    it("does not save a path outside the recipes section", () => {
        LastRecipes.save("/blog/example-article");

        expect(LastRecipes.get()).toBeNull();
    });

    it("does not overwrite the saved URL when an invalid URL is provided", () => {
        LastRecipes.save("/recipes/example-recipe");

        LastRecipes.save("https://example.com/recipes/another-recipe");

        expect(LastRecipes.get()).toBe("/recipes/example-recipe");
    });

    it("returns null when no URL has been saved", () => {
        expect(LastRecipes.get()).toBeNull();
    });

    it("clears the saved URL", () => {
        LastRecipes.save("/recipes/example-recipe");

        LastRecipes.clear();

        expect(LastRecipes.get()).toBeNull();
    });
});
