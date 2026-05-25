// hooks/useLikeComment.ts
"use client";

import { useCallback, useState } from "react";
import { handleApiError } from "../utils/handleError";

type UseLikeCommentParams = {
    commentId: string;
    fingerprint: string;
    initialLikes: string[];
    showMessage: {
        error: (msg: string) => void;
        warning: (msg: string) => void;
    };
    onLikeAnimation?: () => void;
};

export function useLikeComment({ commentId, fingerprint, initialLikes, showMessage, onLikeAnimation }: UseLikeCommentParams) {
    const [likes, setLikes] = useState<string[]>(initialLikes);
    const [isLiking, setIsLiking] = useState(false);

    const alreadyLiked = likes.includes(fingerprint);

    const handleLike = useCallback(async () => {
        if (isLiking || !fingerprint) return;

        setIsLiking(true);

        const prevLikes = likes;
        const wasLiked = alreadyLiked;

        if (!wasLiked) {
            navigator.vibrate?.(10);
            onLikeAnimation?.();
        }

        // optimistic update
        setLikes(prev => (wasLiked ? prev.filter(id => id !== fingerprint) : [...prev, fingerprint]));

        try {
            const res = await fetch("/api/comments", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    commentId,
                    fingerprint,
                    option: "HANDLE_LIKE",
                }),
            });

            const data = await res.json();

            if (!data.ok) {
                setLikes(prevLikes);

                handleApiError(
                    data.error,
                    {
                        COMMENT_NOT_FOUND: msg => showMessage.error(msg),

                        INVALID_INPUT: msg => showMessage.warning(msg),

                        INTERNAL_ERROR: msg => showMessage.error(msg),
                    },
                    msg => showMessage.error(msg)
                );

                return;
            }

            setLikes(data.data.likes);
        } catch (err) {
            setLikes(prevLikes);

            showMessage.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
        } finally {
            setIsLiking(false);
        }
    }, [alreadyLiked, commentId, fingerprint, isLiking, likes, onLikeAnimation, showMessage]);

    return {
        likes,
        isLiking,
        alreadyLiked,
        handleLike,
    };
}
