"use client";
import { useState, useMemo } from "react";
import type { RecipeComment } from "@/types";
import { useFingerprint } from "@/hooks";
export type SortMode = "newest" | "most_liked" | "my_comments";
const STORAGE_KEY = "comments_sort_mode";

export const useCommentsSorting = (comments: RecipeComment[] | null) => {
    const fingerprint = useFingerprint();
    // const [sortMode, setSortMode] = useState<SortMode>("newest");
    const [sortMode, setSortModeInternal] = useState<SortMode>(() => {
        if (typeof window === "undefined") return "newest";

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && ["newest", "most_liked", "my_comments"].includes(saved)) {
            return saved as SortMode;
        }
        return "newest";
    });

    // === NOWOŚĆ: Zapis do localStorage przy każdej zmianie ===
    const setSortMode = (newMode: SortMode) => {
        setSortModeInternal(newMode);
        localStorage.setItem(STORAGE_KEY, newMode);
    };

    const sortedComments = useMemo(() => {
        if (!comments) return [];

        const sorted = [...comments];

        switch (sortMode) {
            case "most_liked":
                sorted.sort((a, b) => {
                    const likesDiff = b.likes.length - a.likes.length;
                    if (likesDiff !== 0) return likesDiff;
                    // Drugi klucz: najnowsze na górze
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                break;

            case "my_comments":
                sorted.sort((a, b) => {
                    const isMyA = a.fingerprint === fingerprint;
                    const isMyB = b.fingerprint === fingerprint;

                    if (isMyA && !isMyB) return -1;
                    if (!isMyA && isMyB) return 1;

                    // Oba moje lub oba nie moje → sort po dacie (najnowsze na górze)
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                break;

            case "newest":
            default:
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return sorted;
    }, [comments, sortMode, fingerprint]);

    return {
        sortMode,
        setSortMode,
        sortedComments,
    };
};
