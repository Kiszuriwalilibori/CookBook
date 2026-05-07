"use client";

import { useState } from "react";

import { Box, Typography } from "@mui/material";

import { RecipeComment } from "@/types";
import { useFingerprint } from "@/hooks";
import CommentForm from "./CommentForm";
import { LikeButton } from "./likeButton";
import { ReplyButton } from "./replyButton";
import ReplyCollapse from "./ReplyCollapse";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { authorAvatarSx, authorChipSx, commentActionsSx, commentCardSx, commentContentWrapperSx, commentDateSx, commentHeaderSx, commentWrapperSx, repliesContainerSx, threadLineSx } from "./commentStyles";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(date));
}

export default function CommentItem({
    comment,
    recipeId,
    refresh,
    depth = 0,
    handleAddComment,
}: {
    comment: RecipeComment;
    recipeId: string;
    refresh: () => void;
    depth?: number;
    handleAddComment: (
        {
            author,
            content,
            parentId,
            isAuthor,
        }: {
            author: string;
            content: string;
            parentId?: string | null;
            isAuthor: boolean;
        },
        options?:
            | {
                  onSuccess?: (() => void) | undefined;
                  onError?: (() => void) | undefined;
              }
            | undefined
    ) => Promise<void>;
}) {
    const [formOpen, setFormOpen] = useState(false);
    const [likes, setLikes] = useState<string[]>(comment.likes);
    const [isLiking, setIsLiking] = useState(false);
    const [animateLike, setAnimateLike] = useState(false);
    const fingerprint = useFingerprint();
    const isAuthorComment = comment.isAuthor === true;

    if (!comment) return null;
    console.log("commentisauthor", comment.isAuthor, "/images/author.jpg");
    const isPending = comment.status === "pending";
    const alreadyLiked = likes.includes(fingerprint);

    async function handleLike() {
        if (isLiking || !fingerprint) return;

        setIsLiking(true);

        const prevLikes = likes;
        const wasLiked = alreadyLiked;
        if (!wasLiked) {
            setAnimateLike(true);
            setTimeout(() => setAnimateLike(false), 300);
        }

        // optimistic update
        setLikes(prev => (wasLiked ? prev.filter(id => id !== fingerprint) : [...prev, fingerprint]));

        try {
            await fetch("/api/comments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commentId: comment._id,
                    fingerprint,
                }),
            });
            refresh();
        } catch (err) {
            console.error("[LIKE][ERROR]", err);

            // rollback
            setLikes(prevLikes);
        } finally {
            setIsLiking(false);
        }
    }
    return (
        <Box sx={commentWrapperSx(depth)}>
            {/* 🌲 vertical thread line */}
            {depth > 0 && <Box sx={threadLineSx} />}

            {/* 📦 content wrapper */}
            <Box sx={commentContentWrapperSx(depth)}>
                {/* 🧱 card */}
                <Box sx={commentCardSx(depth)}>
                    <Box sx={commentHeaderSx}>
                        {isAuthorComment && <Avatar src="/images/author.jpg" alt="Piotr" sx={authorAvatarSx} />}

                        <Typography variant="body2">
                            <strong>{comment.author}</strong>
                        </Typography>

                        {isAuthorComment && <Chip label="Autor" size="small" color="primary" sx={authorChipSx} />}

                        <Typography variant="caption" sx={commentDateSx}>
                            {formatDate(comment.createdAt)}
                        </Typography>
                    </Box>
                    <Typography variant="body2" mb={1}>
                        {comment.content}
                    </Typography>

                    {isPending && (
                        <Typography variant="caption" color="warning.main">
                            Oczekuje na moderację...
                        </Typography>
                    )}

                    <Box sx={commentActionsSx}>
                        <LikeButton alreadyLiked={alreadyLiked} likesCount={likes.length} isLiking={isLiking} animate={animateLike} onLike={handleLike} />

                        <ReplyButton onToggle={() => setFormOpen(v => !v)} />
                    </Box>

                    <ReplyCollapse open={formOpen}>
                        <Box>
                            <CommentForm
                                key={formOpen ? "open" : "closed"}
                                submitLabel="Odpowiedz"
                                onSubmit={async data => {
                                    setFormOpen(false);
                                    await handleAddComment({
                                        ...data,
                                        parentId: comment._id,
                                    });
                                }}
                                onCancel={() => setFormOpen(false)}
                            />
                        </Box>
                    </ReplyCollapse>

                    {/* 👇 REPLIES */}
                    <Box sx={repliesContainerSx}>
                        {(comment.replies ?? []).filter(Boolean).map(reply => (
                            <CommentItem key={reply._id} comment={reply} recipeId={recipeId} refresh={refresh} depth={depth + 1} handleAddComment={handleAddComment} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
