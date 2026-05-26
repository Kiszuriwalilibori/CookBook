"use client";

import { useCallback } from "react";

import { handleApiError } from "../utils/handleError";

import { useOptimisticMutation } from "./useOptimisticMutation";

type UseShortCommentParams = {
    initialShortComment?: string;

    showMessage: {
        success: (msg: string) => void;
        error: (msg: string) => void;
        warning: (msg: string) => void;
    };
};

type ShortCommentResponse = {
    ok: boolean;

    error?: unknown;

    data: {
        shortComment: {
            content: string;
        };
    };
};

export function useShortComment({ initialShortComment = "", showMessage }: UseShortCommentParams) {
    const { state: shortComment, setState: setShortComment, isPending: isShortCommentSubmitting, run } = useOptimisticMutation<string>(initialShortComment);

    const handleAddShortComment = useCallback(
        async ({ commentId, shortContent }: { commentId: string; shortContent: string }) => {
            const trimmedContent = shortContent.trim();

            if (!commentId || !trimmedContent) {
                showMessage.warning("Brak treści skróconego komentarza");

                return false;
            }

            try {
                await run<ShortCommentResponse>({
                    optimisticUpdate: () => trimmedContent,

                    mutation: async () => {
                        const res = await fetch("/api/comments", {
                            method: "PATCH",

                            headers: {
                                "Content-Type": "application/json",
                            },

                            body: JSON.stringify({
                                commentId,
                                shortContent: trimmedContent,
                                option: "HANDLE_SHORT_COMMENT",
                            }),
                        });

                        const data = (await res.json()) as ShortCommentResponse;

                        if (!data.ok) {
                            throw data.error;
                        }

                        return data;
                    },

                    onSuccess: result => {
                        showMessage.success("Skrócony komentarz został dodany");

                        return result.data.shortComment.content;
                    },
                });

                return true;
            } catch (error) {
                handleApiError(
                    error,
                    {
                        FORBIDDEN: () => showMessage.error("Brak uprawnień administratora"),

                        INVALID_INPUT: () => showMessage.warning("Nieprawidłowe dane"),

                        EMPTY_SHORT_COMMENT: () => showMessage.warning("Skrócony komentarz nie może być pusty"),

                        SHORT_COMMENT_TOO_LONG: () => showMessage.warning("Skrócony komentarz jest za długi"),

                        COMMENT_NOT_FOUND: () => showMessage.warning("Komentarz nie został znaleziony"),
                    },
                    msg => showMessage.error(msg || "Nie udało się dodać skróconego komentarza")
                );

                return false;
            }
        },
        [run, showMessage]
    );

    return {
        shortComment,

        setShortComment,

        isShortCommentSubmitting,

        handleAddShortComment,
    };
}
