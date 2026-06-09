"use client";

import { useCallback, useMemo } from "react";

import { handleApiError } from "./handleApiError";

import { useOptimisticMutation } from "./useOptimisticMutation";
// import ApiResponse from "@/models/apiResponse";

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

type LikeCommentResponse = {
    ok: boolean;

    error?: unknown;

    data: {
        likes: string[];
    };
};
// type LikeCommentResponse = ApiResponse<{
//     likes: string[];
// }>;
export function useLikeComment({ commentId, fingerprint, initialLikes, showMessage, onLikeAnimation }: UseLikeCommentParams) {
    const { state: likes, setState: setLikes, isPending: isLiking, run } = useOptimisticMutation<string[]>(initialLikes);

    const alreadyLiked = useMemo(() => likes.includes(fingerprint), [likes, fingerprint]);

    const handleLike = useCallback(async () => {
        if (isLiking || !fingerprint) {
            return;
        }

        const wasLiked = alreadyLiked;

        if (!wasLiked) {
            navigator.vibrate?.(10);

            onLikeAnimation?.();
        }

        try {
            await run<LikeCommentResponse>({
                optimisticUpdate: prev => (wasLiked ? prev.filter(id => id !== fingerprint) : [...prev, fingerprint]),

                mutation: async () => {
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

                    const data = (await res.json()) as LikeCommentResponse;

                    if (!data.ok) {
                        throw data.error;
                    }

                    return data;
                },

                onSuccess: result => result.data.likes,
            });
        } catch (error) {
            handleApiError(
                error,
                {
                    COMMENT_NOT_FOUND: msg => showMessage.error(String(msg)),

                    INVALID_INPUT: msg => showMessage.warning(String(msg)),

                    INTERNAL_ERROR: msg => showMessage.error(String(msg)),
                },
                msg => showMessage.error(msg)
            );
        }
    }, [alreadyLiked, commentId, fingerprint, isLiking, onLikeAnimation, run, showMessage]);

    return {
        likes,
        setLikes,

        isLiking,

        alreadyLiked,

        handleLike,
    };
}
