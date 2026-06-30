"use client";

import { useState, useCallback } from "react";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useResetFavoritesOnLogout } from "./useResetFavoritesOnLogout";
import { handleApiError } from "@/app/(main)/recipes/[slug]/parts/Comments/utils";
import useMessage from "./useMessage";

export const useFavorites = () => {
    const { favorites, add, remove } = useFavoritesStore();
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
    const showMessage = useMessage();
    useResetFavoritesOnLogout();
    const startLoading = useCallback((recipeId: string) => {
        setLoadingIds(prev => {
            const next = new Set(prev);
            next.add(recipeId);
            return next;
        });
    }, []);

    const stopLoading = useCallback((recipeId: string) => {
        setLoadingIds(prev => {
            const next = new Set(prev);
            next.delete(recipeId);
            return next;
        });
    }, []);

    const isLoading = useCallback((recipeId: string) => loadingIds.has(recipeId), [loadingIds]);

    const addFavorite = useCallback(
        async (recipeId: string) => {
            if (loadingIds.has(recipeId)) return;

            startLoading(recipeId);
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
                showMessage.success(`❤️ Dodano do ulubionych: "${data.data.title}" `);
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
                stopLoading(recipeId);
            }
        },
        [loadingIds, startLoading, add, remove, showMessage, stopLoading]
    );

    const removeFavorite = useCallback(
        async (recipeId: string) => {
            if (loadingIds.has(recipeId)) return;

            startLoading(recipeId);
            remove(recipeId);

            try {
                const response = await fetch("/api/favorites", {
                    method: "DELETE",
                    body: JSON.stringify({ recipeId }),
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok || !data.ok) {
                    throw data.error;
                }
                showMessage.success(`🤍 Usunięto z ulubionych: "${data.data.title}" `);
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
                stopLoading(recipeId);
            }
        },
        [loadingIds, startLoading, remove, add, showMessage, stopLoading]
    );

    return { favorites, addFavorite, removeFavorite, isLoading };
};

// todo trzeba skonsumować odpowiedzi
