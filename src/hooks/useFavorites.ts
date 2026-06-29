"use client";

import { useState, useCallback } from "react";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useResetFavoritesOnLogout } from "./useResetFavoritesOnLogout";

export const useFavorites = () => {
    const { favorites, add, remove } = useFavoritesStore();
    const [loading, setLoading] = useState(false);

    useResetFavoritesOnLogout();

    const addFavorite = useCallback(
        async (recipeId: string) => {
            if (loading) return;
            setLoading(true);
            add(recipeId);

            try {
                const response = await fetch("/api/favorites", {
                    method: "POST",
                    body: JSON.stringify({ recipeId }),
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok || !data.ok) {
                    throw new Error(data.error?.message ?? "Nie udało się dodać ulubionego");
                }
            } catch {
                remove(recipeId);
            } finally {
                setLoading(false);
            }
        },
        [loading, add, remove]
    );

    const removeFavorite = useCallback(
        async (recipeId: string) => {
            console.log("remove from removeFavorite", recipeId);
            if (loading) return;
            setLoading(true);
            remove(recipeId);

            try {
                const response = await fetch("/api/favorites", {
                    method: "DELETE",
                    body: JSON.stringify({ recipeId }),
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                const data = await response.json();

                console.log("data favorites DELETE", data);
                if (!response.ok || !data.ok) {
                    throw new Error(data.error?.message ?? "Nie udało się usunąć ulubionego");
                }
            } catch {
                add(recipeId);
            } finally {
                setLoading(false);
            }
        },
        [loading, add, remove]
    );

    return { favorites, addFavorite, removeFavorite, loading };
};

// todo trzeba skonsumować odpowiedzi
