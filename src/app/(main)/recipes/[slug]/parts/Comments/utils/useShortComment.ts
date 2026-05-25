// hooks/useShortComment.ts
"use client";

import { useCallback, useState } from "react";
import { handleApiError } from "../utils/handleError";

type UseShortCommentParams = {
    initialShortComment?: string;
    showMessage: {
        success: (msg: string) => void;
        error: (msg: string) => void;
        warning: (msg: string) => void;
    };
};

export function useShortComment({ initialShortComment = "", showMessage }: UseShortCommentParams) {
    const [shortComment, setShortComment] = useState(initialShortComment);

    const [isShortCommentSubmitting, setIsShortCommentSubmitting] = useState(false);

    const handleAddShortComment = useCallback(
        async ({ commentId, shortContent }: { commentId: string; shortContent: string }) => {
            if (!commentId || !shortContent.trim()) {
                showMessage.warning("Brak treści skróconego komentarza");

                return false;
            }

            const prevShortComment = shortComment;

            setShortComment(shortContent.trim());
            setIsShortCommentSubmitting(true);

            try {
                const res = await fetch("/api/comments", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        commentId,
                        shortContent: shortContent.trim(),
                        option: "HANDLE_SHORT_COMMENT",
                    }),
                });

                const responseData = await res.json();

                if (!responseData.ok) {
                    setShortComment(prevShortComment);

                    handleApiError(
                        responseData.error,
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

                setShortComment(responseData.data.shortComment.content);

                showMessage.success("Skrócony komentarz został dodany");

                return true;
            } catch (err) {
                setShortComment(prevShortComment);

                handleApiError(err, {}, msg => showMessage.error(msg));

                return false;
            } finally {
                setIsShortCommentSubmitting(false);
            }
        },
        [shortComment, showMessage]
    );

    return {
        shortComment,
        isShortCommentSubmitting,
        handleAddShortComment,
    };
}
