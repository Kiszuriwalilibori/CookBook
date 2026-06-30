"use client";

import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useEffect } from "react";

import type { ApiSuccessResponse } from "@/types";
import { ApiErrorResponse } from "@/app/api/comments/comment.service";
import { useMessage } from "@/hooks";

export default function FavoritesInitializer() {
    const showMessage = useMessage();
    const { setFavorites, hydrated } = useFavoritesStore();

    useEffect(() => {
        if (hydrated) return;

        const fetchFavorites = async () => {
            try {
                const res = await fetch("/api/favorites", {
                    credentials: "include",
                });

                const result: ApiSuccessResponse<string[]> | ApiErrorResponse = await res.json();

                if (!res.ok || !result.ok) {
                    showMessage.error(result.ok ? "Nie udało się pobrać ulubionych." : result.error.message);
                    return;
                }

                setFavorites(result.data);
            } catch {
                showMessage.error("Nie udało się pobrać ulubionych.");
            }
        };

        fetchFavorites();
    }, [hydrated, setFavorites]);

    return null;
}
