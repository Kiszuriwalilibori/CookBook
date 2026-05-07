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
        <Box
            sx={{
                position: "relative",
                display: "flex",
                ml: depth > 0 ? 2 : 0,
            }}
        >
            {/* 🌲 vertical thread line */}
            {depth > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        bgcolor: "divider",
                        borderRadius: 1,
                    }}
                />
            )}

            {/* 📦 content wrapper */}
            <Box
                sx={{
                    flex: 1,
                    pl: depth > 0 ? 2 : 0,
                }}
            >
                {/* 🧱 card */}
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: depth === 0 ? "background.paper" : "action.hover",
                        transition: "background 0.2s ease",
                        position: "relative",
                    }}
                >
                    {/* 👇 TWOJA ORYGINALNA ZAWARTOŚĆ (bez zmian) */}

                    {/* <Typography variant="body2" mb={1}>
                        <strong>{comment.author}</strong> w dniu {formatDate(comment.createdAt)} napisał:
                    </Typography> */}
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {isAuthorComment && <Avatar src="/images/author.jpg" alt="Piotr" sx={{ width: 28, height: 28 }} />}

                        <Typography variant="body2">
                            <strong>{comment.author}</strong>
                        </Typography>

                        {isAuthorComment && <Chip label="Autor" size="small" color="primary" sx={{ height: 20, fontSize: 11 }} />}

                        <Typography variant="caption" sx={{ ml: 0.5 }}>
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

                    <Box display="flex" alignItems="center" gap={1}>
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
                    <Box mt={1} display="flex" flexDirection="column" gap={1}>
                        {(comment.replies ?? []).filter(Boolean).map(reply => (
                            <CommentItem key={reply._id} comment={reply} recipeId={recipeId} refresh={refresh} depth={depth + 1} handleAddComment={handleAddComment} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
