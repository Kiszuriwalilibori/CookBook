"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminStore, useIsUserLogged } from "@/stores/useAdminStore";

interface UseFavoritesReturn {
    favorites: Set<string>;
    addFavorite: (recipeId: string) => Promise<void>;
    removeFavorite: (recipeId: string) => Promise<void>;
    loading: boolean;
}

export const useFavorites = (): UseFavoritesReturn => {
    const isUserLogged = useIsUserLogged();
    const googleToken = useAdminStore(state => state.googleToken);

    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    // Fetch favorites from backend
    useEffect(() => {
        if (!isUserLogged || !googleToken) return;

        const fetchFavorites = async () => {
            try {
                const res = await fetch("/api/favorites/list", {
                    headers: { Authorization: `Bearer ${googleToken}` },
                    credentials: "include",
                });
                const data: { recipe: { _id: string } }[] = await res.json();
                const ids = new Set(data.map(f => f.recipe._id));
                setFavorites(ids);
            } catch (err) {
                console.error("[useFavorites] Error fetching favorites:", err);
            }
        };

        fetchFavorites();
    }, [isUserLogged, googleToken]);

    const addFavorite = useCallback(
        async (recipeId: string) => {
            if (!isUserLogged || !googleToken || loading) return;
            setLoading(true);
            try {
                await fetch("/api/favorites", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${googleToken}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ recipeId }),
                    credentials: "include",
                });
                setFavorites(prev => new Set(prev).add(recipeId));
            } catch (err) {
                console.error("[useFavorites] Error adding favorite:", err);
            } finally {
                setLoading(false);
            }
        },
        [isUserLogged, googleToken, loading]
    );

    const removeFavorite = useCallback(
        async (recipeId: string) => {
            if (!isUserLogged || !googleToken || loading) return;
            setLoading(true);
            try {
                await fetch("/api/favorites", {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${googleToken}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ recipeId }),
                    credentials: "include",
                });
                setFavorites(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(recipeId);
                    return newSet;
                });
            } catch (err) {
                console.error("[useFavorites] Error removing favorite:", err);
            } finally {
                setLoading(false);
            }
        },
        [isUserLogged, googleToken, loading]
    );

    return { favorites, addFavorite, removeFavorite, loading };
};
