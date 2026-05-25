// hooks/useReplyComment.ts
"use client";

import { useCallback, useState } from "react";

type AddCommentPayload = {
    author: string;
    content: string;
    parentId?: string | null;
};

type HandleAddComment = (payload: AddCommentPayload) => Promise<void>;

type UseReplyCommentParams = {
    commentId: string;
    handleAddComment: HandleAddComment;
};

export function useReplyComment({ commentId, handleAddComment }: UseReplyCommentParams) {
    const [formOpen, setFormOpen] = useState(false);

    const [isReplySubmitting, setIsReplySubmitting] = useState(false);

    const handleReplySubmit = useCallback(
        async ({ author, content }: { author: string; content: string }) => {
            setFormOpen(false);
            setIsReplySubmitting(true);

            try {
                await handleAddComment({
                    author,
                    content,
                    parentId: commentId,
                });
            } finally {
                setIsReplySubmitting(false);
            }
        },
        [commentId, handleAddComment]
    );

    const handleReplyCancel = useCallback(() => {
        setFormOpen(false);
    }, []);

    const toggleReplyForm = useCallback(() => {
        setFormOpen(prev => !prev);
    }, []);

    return {
        formOpen,
        isReplySubmitting,
        handleReplySubmit,
        handleReplyCancel,
        toggleReplyForm,
    };
}
