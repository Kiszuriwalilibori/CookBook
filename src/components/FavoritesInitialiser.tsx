"use client";

import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useEffect } from "react";

export default function FavoritesInitializer() {
    const { setFavorites, hydrated } = useFavoritesStore();
    console.log("FavoritesInitializer");

    // 🔥 fetch tylko RAZ
    useEffect(() => {
        if (hydrated) return;

        const fetchFavorites = async () => {
            const res = await fetch("/api/favorites", {
                credentials: "include",
            });
            console.log("FavoritesInitializer useeffect", res);
            const data: { _id: string }[] = await res.json();
            if (!Array.isArray(data)) return;
            console.log(
                "FavoritesInitializer useeffect data",
                data,
                data.map(r => r._id)
            );

            setFavorites(data.map(r => r._id));
        };

        fetchFavorites();
    }, [
        hydrated,
        /*hydrated, setFavorites*/
    ]);

    return null;
}
