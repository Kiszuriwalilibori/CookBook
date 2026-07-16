"use client";

import { useCallback } from "react";
import { ApiResponse, ApiSuccessResponse } from "@/models/apiResponse";

type ShortCommentData = {
    shortComment: {
        content: string;
    };
};

import { useOptimisticMutation } from "./useOptimisticMutation";
import { useApiResponseErrorHandler, useMessage } from "@/hooks";

type UseShortCommentArgs = {
    initialShortComment?: string;
};

export function useShortComment({ initialShortComment = "" }: UseShortCommentArgs) {
    const { state: shortComment, setState: setShortComment, isPending: isShortCommentSubmitting, run } = useOptimisticMutation<string>(initialShortComment);
    const handleApiResponseError = useApiResponseErrorHandler();
    const showMessage = useMessage();
    const handleAddShortComment = useCallback(
        async ({ commentId, shortContent }: { commentId: string; shortContent: string }) => {
            const trimmedContent = shortContent.trim();

            if (!commentId || !trimmedContent) {
                showMessage.warning("Brak treści skróconego komentarza");

                return false;
            }

            try {
                await run<ApiSuccessResponse<ShortCommentData>>({
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

                        const data = (await res.json()) as ApiResponse<ShortCommentData>;

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
                handleApiResponseError(error, {
                    FORBIDDEN: {
                        type: "error",
                        message: "Brak uprawnień administratora",
                    },
                    INVALID_INPUT: {
                        type: "warning",
                        message: "Nieprawidłowe dane",
                    },
                    EMPTY_SHORT_COMMENT: {
                        type: "warning",
                        message: "Skrócony komentarz nie może być pusty",
                    },
                    SHORT_COMMENT_TOO_LONG: {
                        type: "warning",
                        message: "Skrócony komentarz jest za długi",
                    },
                    COMMENT_NOT_FOUND: {
                        type: "warning",
                        message: "Komentarz nie został znaleziony",
                    },
                });
                // handleApiError(
                //     error,
                //     {
                //         FORBIDDEN: () => showMessage.error("Brak uprawnień administratora"),

                //         INVALID_INPUT: () => showMessage.warning("Nieprawidłowe dane"),

                //         EMPTY_SHORT_COMMENT: () => showMessage.warning("Skrócony komentarz nie może być pusty"),

                //         SHORT_COMMENT_TOO_LONG: () => showMessage.warning("Skrócony komentarz jest za długi"),

                //         COMMENT_NOT_FOUND: () => showMessage.warning("Komentarz nie został znaleziony"),
                //     },
                //     msg => showMessage.error(msg || "Nie udało się dodać skróconego komentarza")
                // );

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
