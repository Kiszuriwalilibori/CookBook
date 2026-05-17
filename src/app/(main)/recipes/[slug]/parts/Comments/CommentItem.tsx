"use client";
import { useState } from "react";

import { Box, Typography } from "@mui/material";
import { RecipeComment } from "@/types";
import { useFingerprint, useMessage } from "@/hooks";
import CommentForm from "./CommentForm";

import { ReplyButton } from "./ReplButton";
import ReplyCollapse from "./ReplyCollapse";

import { commentActionsSx, commentCardSx, commentContentWrapperSx, commentWrapperSx, repliesContainerSx, threadLineSx } from "./commentStyles";
import { handleApiError } from "./utils/handleError";
import LikeItButton from "./LikeItButton";
import { LoadingIndicator } from "@/components";
import { checkIsOwnComment, useLikeAnimation, getRelativeTime, useSetInitialFocusInCommentItem, getAbsoluteCommentDate } from "./utils";
import CommentItemHeader from "./CommentItemHeader";

type AddCommentPayload = {
    author: string;
    content: string;
    parentId?: string | null;
};

type AddCommentOptions = {
    onSuccess?: () => void;
    onError?: () => void;
};

type HandleAddComment = (payload: AddCommentPayload, options?: AddCommentOptions) => Promise<void>;

interface CommentItemProps {
    comment: RecipeComment;
    recipeId: string;

    depth?: number;
    handleAddComment: HandleAddComment;
}

export default function CommentItem({ comment, recipeId, depth = 0, handleAddComment }: CommentItemProps) {
    const [formOpen, setFormOpen] = useState(false);
    const [likes, setLikes] = useState<string[]>(comment.likes);
    const [isLiking, setIsLiking] = useState(false);
    const [isReplySubmitting, setIsReplySubmitting] = useState(false);
    const { animateLike, triggerLikeAnimation } = useLikeAnimation(300);
    const fingerprint = useFingerprint();
    const showMessage = useMessage();
    const isAuthorComment = comment.isAuthor === true;
    const isOwnComment = checkIsOwnComment(fingerprint, comment.fingerprint);
    const textAreaRef = useSetInitialFocusInCommentItem(formOpen);

    if (!comment) return null;

    const alreadyLiked = likes.includes(fingerprint);

    async function handleLike() {
        if (isLiking || !fingerprint) return;

        setIsLiking(true);
        const prevLikes = likes;
        const wasLiked = alreadyLiked;

        if (!wasLiked) {
            navigator.vibrate?.(10);
            triggerLikeAnimation();
        }
        // optimistic update
        setLikes(prev => (wasLiked ? prev.filter(id => id !== fingerprint) : [...prev, fingerprint]));

        try {
            const res = await fetch("/api/comments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commentId: comment._id,
                    fingerprint,
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
            } else {
                setLikes(data.data.likes);
            }
        } catch (err: unknown) {
            // console.error("[COMMENTS][PATCH]", err);
            setLikes(prevLikes);
            showMessage.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
        } finally {
            setIsLiking(false);
        }
    }
    return (
        <Box sx={commentWrapperSx(depth)} id={`comment-${comment._id}`}>
            {/* 🌲 vertical thread line */}
            {depth > 0 && <Box sx={threadLineSx} />}

            {/* 📦 content wrapper */}
            <Box sx={commentContentWrapperSx(depth)}>
                {/* 🧱 card */}
                <Box sx={commentCardSx(depth, isOwnComment)}>
                    <LoadingIndicator open={isReplySubmitting} prompt="Dodawanie odpowiedzi w toku" />
                    <CommentItemHeader author={comment.author} createdAt={comment.createdAt} isAuthorComment={isAuthorComment} relativeTime={getRelativeTime(comment.createdAt)} absoluteDate={getAbsoluteCommentDate(comment.createdAt)} />

                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {comment.content}
                    </Typography>

                    <Box sx={commentActionsSx}>
                        <LikeItButton alreadyLiked={alreadyLiked} likesCount={likes.length} isLiking={isLiking} animate={animateLike} onLike={handleLike} />

                        <ReplyButton onToggle={() => setFormOpen(v => !v)} commentId={comment._id} author={comment.author} />
                    </Box>

                    <ReplyCollapse open={formOpen} commentId={comment._id}>
                        <Box>
                            <CommentForm
                                textAreaRef={textAreaRef}
                                key={formOpen ? "open" : "closed"}
                                submitLabel="Odpowiedz"
                                onSubmit={async data => {
                                    setFormOpen(false);
                                    setIsReplySubmitting(true);
                                    try {
                                        await handleAddComment({
                                            ...data,
                                            parentId: comment._id,
                                        });
                                    } finally {
                                        setIsReplySubmitting(false);
                                    }
                                }}
                                onCancel={() => setFormOpen(false)}
                            />
                        </Box>
                    </ReplyCollapse>

                    {/* 👇 REPLIES */}
                    <Box sx={repliesContainerSx}>
                        {(comment.replies ?? []).filter(Boolean).map(reply => (
                            <CommentItem key={reply._id} comment={reply} recipeId={recipeId} depth={depth + 1} handleAddComment={handleAddComment} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
