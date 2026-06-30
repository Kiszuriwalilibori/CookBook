"use client";

import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useEffect } from "react";

// export default function FavoritesInitializer() {
//     const { setFavorites, hydrated } = useFavoritesStore();

//     // 🔥 fetch tylko RAZ
//     useEffect(() => {
//         if (hydrated) return;

//         const fetchFavorites = async () => {
//             const res = await fetch("/api/favorites", {
//                 credentials: "include",
//             });

//             const data: { _id: string }[] = await res.json();
//             if (!Array.isArray(data)) return;

//             setFavorites(data.map(r => r._id));
//         };

//         fetchFavorites();
//     }, [hydrated]);

//     return null;
// }

import type { ApiSuccessResponse } from "@/types";
import { ApiErrorResponse } from "@/app/api/comments/comment.service";

export default function FavoritesInitializer() {
    const { setFavorites, hydrated } = useFavoritesStore();

    useEffect(() => {
        if (hydrated) return;

        const fetchFavorites = async () => {
            const res = await fetch("/api/favorites", {
                credentials: "include",
            });
            if (!res.ok) return;
            const result: ApiSuccessResponse<string[]> | ApiErrorResponse = await res.json();

            if (!result.ok) return;

            setFavorites(result.data);
        };

        fetchFavorites();
    }, [hydrated, setFavorites]);

    return null;
}
