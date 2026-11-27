/*
 * Testy sprawdzają:
 * - zapisywanie aktualnego URL po zamontowaniu komponentu,
 * - uwzględnianie parametrów query string w zapisywanym URL.
 */

import { render } from "@testing-library/react";

import LastRecipesTracker from "./LastRecipesTracker";
import { LastRecipes } from "@/utils/LastRecipes";

jest.mock("@/utils/LastRecipes", () => ({
    LastRecipes: {
        save: jest.fn(),
    },
}));

describe("LastRecipesTracker", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        window.history.replaceState({}, "", "/");
    });

    it("saves the current URL including query parameters after mounting", () => {
        window.history.replaceState({}, "", "/recipes?tags=vegetarian&cuisine=italian");

        render(<LastRecipesTracker />);

        expect(LastRecipes.save).toHaveBeenCalledTimes(1);
        expect(LastRecipes.save).toHaveBeenCalledWith("/recipes?tags=vegetarian&cuisine=italian");
    });
});
