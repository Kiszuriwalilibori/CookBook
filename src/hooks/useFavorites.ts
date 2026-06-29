"use client";

import { useState, useCallback } from "react";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useResetFavoritesOnLogout } from "./useResetFavoritesOnLogout";
import { handleApiError } from "@/app/(main)/recipes/[slug]/parts/Comments/utils";
import useMessage from "./useMessage";

export const useFavorites = () => {
    const { favorites, add, remove } = useFavoritesStore();
    const [loading, setLoading] = useState(false);
    const showMessage = useMessage();
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
                    throw data.error;
                }
            } catch (error) {
                remove(recipeId);
                handleApiError(
                    error,
                    {
                        ALREADY_FAVORITE: msg => showMessage.warning(msg),
                        MISSING_USER: msg => showMessage.error(msg),
                        RECIPE_NOT_FOUND: msg => showMessage.error(msg),
                    },
                    msg => showMessage.error(msg)
                );
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
                    throw data.error;
                }
            } catch (error) {
                add(recipeId);
                handleApiError(
                    error,
                    {
                        FAVORITE_NOT_FOUND: msg => showMessage.warning(msg),
                        MISSING_USER: msg => showMessage.error(msg),
                    },
                    msg => showMessage.error(msg)
                );
            } finally {
                setLoading(false);
            }
        },
        [loading, add, remove]
    );

    return { favorites, addFavorite, removeFavorite, loading };
};

// todo trzeba skonsumować odpowiedzi
