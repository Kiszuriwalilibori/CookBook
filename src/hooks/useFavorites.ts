
"use client";

import { useState, useEffect, useCallback } from "react";
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
    
const addFavorite = useCallback(
    async (recipeId: string) => {
        if (loading) return;
        setLoading(true);
        add(recipeId);

        try {
            await fetch("/api/favorites", {
                method: "POST",
                body: JSON.stringify({ recipeId }),
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
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
    },
    [loading, add, remove]
);

    return { favorites, addFavorite, removeFavorite, loading };
};
