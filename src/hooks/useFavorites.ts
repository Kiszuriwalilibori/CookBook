
// // todo
// // Pomysł na cache dla ulubionych (favorites) w CookBook:

// // Cel:

// // Zmniejszyć liczbę zapytań do backendu /api/favorites/list przy przechodzeniu między stronami lub renderowaniu wielu komponentów.

// // Zachować spójność stanu ulubionych bez powtarzających się fetchy.

// // Przyspieszyć renderowanie RecipeCard z poprawnym isFavorite.

// // Mechanika (frontend):

// // Trzymać globalny stan ulubionych w store (np. Zustand/Redux/Context).

// // favoritesCache: Set<string> lub Map<string, FavoriteData> gdzie kluczem jest recipeId.

// // Hook useFavorites najpierw sprawdza cache:

// // if (favoritesCache.has(recipeId)) {
// //     return favoritesCache.get(recipeId);
// // } else {
// //     fetchFavoritesFromServer();
// // }

// // Po fetchu: zaktualizować cache i powiadomić subskrybentów (RecipeClient lub inne komponenty).

// // Mechanika (backend):

// // Bez zmian, API /favorites/list zwraca ulubione dla zalogowanego usera.

// // Cache będzie wyłącznie po stronie frontend, więc backend pozostaje prosty.

// // Zalety:

// // Jedno pobranie favorites na sesję lub do momentu odświeżenia/stanu zmiany usera.

// // Minimalizacja GET /favorites/list przy renderowaniu wielu RecipeCard na jednej stronie.

// // Możliwość „optimistic update” w toggle: zmiana w UI natychmiast, backend fetch potwierdza lub rollback.

// // Dodatkowe opcje:

// // Można dodać TTL (time-to-live), żeby cache automatycznie się odświeżał po np. 5–10 minutach.

// // Można implementować „reactive cache”: subskrybenci automatycznie się rerenderują po update cache (Zustand + subscribe).

"use client";

import { useState, useEffect } from "react";
import { useAdminStore, useIsUserLogged } from "@/stores/useAdminStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useResetFavoritesOnLogout } from "./useResetFavoritesOnLogout";

export const useFavorites = () => {
    const isUserLogged = useIsUserLogged();
    const googleToken = useAdminStore(s => s.googleToken);

    const { favorites, setFavorites, add, remove, hydrated } = useFavoritesStore();

    const [loading, setLoading] = useState(false);

    // 🔥 fetch tylko RAZ
    useEffect(() => {
        if (!isUserLogged || !googleToken || hydrated) return;

        const fetchFavorites = async () => {
            const res = await fetch("/api/favorites", {
                credentials: "include",
            });
            const data: { _id: string }[] = await res.json();
            if (!Array.isArray(data)) return;
            setFavorites(data.map(r => r._id));
        };

        fetchFavorites();
    }, [isUserLogged, googleToken, hydrated, setFavorites]);
    useResetFavoritesOnLogout();
    const addFavorite = async (recipeId: string) => {
        if (loading) return;
        setLoading(true);
        add(recipeId); // optimistic

        try {
            await fetch("/api/favorites", {
                method: "POST",
                body: JSON.stringify({ recipeId }),
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
        } catch {
            remove(recipeId); // rollback
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (recipeId: string) => {
        if (loading) return;
        setLoading(true);
        remove(recipeId);

        try {
            await fetch("/api/favorites", {
                method: "DELETE",
                body: JSON.stringify({ recipeId }),
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
        } catch {
            add(recipeId);
        } finally {
            setLoading(false);
        }
    };

    return { favorites, addFavorite, removeFavorite, loading };
};
