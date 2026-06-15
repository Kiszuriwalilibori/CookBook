"use client";

import { useState, useCallback } from "react";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useResetFavoritesOnLogout } from "./useResetFavoritesOnLogout";
import { useRouter } from "next/navigation";

export const useFavorites = () => {
    const { favorites, add, remove } = useFavoritesStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                console.log(data);
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
                const res = await fetch("/api/favorites", {
                    method: "DELETE",
                    body: JSON.stringify({ recipeId }),
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                const data = await res.json();

                console.log("data favorites DELETE", data);
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
