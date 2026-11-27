// const STORAGE_KEY = "last-recipes-url";

// export class LastRecipes {
//     static save(url: string): void {
//         if (typeof window === "undefined") return;

//         try {
//             const parsedUrl = new URL(url, window.location.origin);

//             if (parsedUrl.origin !== window.location.origin) return;
//             if (!/^\/recipes(?:\/[^/]+)?$/.test(parsedUrl.pathname)) return;

//             const value = `${parsedUrl.pathname}${parsedUrl.search}`;

//             sessionStorage.setItem(STORAGE_KEY, value);
//         } catch {
//             // Niedostępny storage lub nieprawidłowy URL.
//         }
//     }

//     static get(): string | null {
//         if (typeof window === "undefined") return null;

//         try {
//             const value = sessionStorage.getItem(STORAGE_KEY);

//             if (!value) return null;

//             const parsedUrl = new URL(value, window.location.origin);

//             if (parsedUrl.origin !== window.location.origin) return null;
//             if (!/^\/recipes(?:\/[^/]+)?$/.test(parsedUrl.pathname)) return null;

//             return `${parsedUrl.pathname}${parsedUrl.search}`;
//         } catch {
//             return null;
//         }
//     }

//     static clear(): void {
//         if (typeof window === "undefined") return;

//         try {
//             sessionStorage.removeItem(STORAGE_KEY);
//         } catch {
//             // Brak możliwości usunięcia zapisu.
//         }
//     }
// }

import { useLastRecipesStore } from "@/stores/useLastRecipesStore";

export class LastRecipes {
    static save(url: string): void {
        if (typeof window === "undefined") return;

        try {
            const parsedUrl = new URL(url, window.location.origin);

            if (parsedUrl.origin !== window.location.origin) return;
            if (!/^\/recipes(?:\/[^/]+)?$/.test(parsedUrl.pathname)) return;

            const value = `${parsedUrl.pathname}${parsedUrl.search}`;

            useLastRecipesStore.getState().setLastRecipesUrl(value);
        } catch {
            // Nieprawidłowy URL.
        }
    }

    static get(): string | null {
        return useLastRecipesStore.getState().lastRecipesUrl;
    }

    static clear(): void {
        useLastRecipesStore.getState().setLastRecipesUrl(null);
    }
}
