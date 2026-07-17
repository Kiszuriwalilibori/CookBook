"use client";
import { useEffect } from "react";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useMessage } from "@/hooks";
import { ApiResponse } from "@/models/apiResponse";

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

                const result: ApiResponse<string[]> = await res.json();

                if (!result.ok) {
                    showMessage.error(result.error.message);
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
