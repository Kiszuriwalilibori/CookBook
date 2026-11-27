import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LastRecipesState {
    lastRecipesUrl: string | null;
    setLastRecipesUrl: (url: string | null) => void;
}

export const useLastRecipesStore = create<LastRecipesState>()(
    persist(
        set => ({
            lastRecipesUrl: null,

            setLastRecipesUrl: url => set({ lastRecipesUrl: url }),
        }),
        {
            name: "last-recipes-store",
            storage: createJSONStorage(() => sessionStorage),
            skipHydration: true,
        }
    )
);
