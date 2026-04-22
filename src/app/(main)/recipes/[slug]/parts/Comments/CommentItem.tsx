// TODO Jeśli chcesz, mogę dorzucić jeszcze:
// 👉
// prosty backend guard typu „1 like per fingerprint” (Mongo / Prisma)
// Masz teraz dwa źródła prawdy dla autora:

// frontend (input / admin override)
// backend (brak walidacji autora poza required)

// Jeśli chcesz poziom wyżej (bardziej „production-grade”), to:

// admin author = enforce na backendzie (np. z cookie / session)
// frontend tylko UX

// Na teraz to, co masz, jest w pełni OK.

// Jeśli chcesz,
// mogę Ci w kolejnym kroku pokazać wersję, gdzie:

// admin jest rozpoznawany backendowo
// i nie da się spoofować "Piotr" z frontu (to jedyny realny loophole w obecnym setupie)

// Jeśli będziesz chciał, mogę w następnym kroku:

// spiąć honeypot tak, żeby działał bez document.getElementById
// albo
// dorzucić walidację + UX typu „disabled + loading + error inline”

"use client";

import { useState } from "react";
import { alpha } from "@mui/material/styles";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import { RecipeComment } from "@/types";
import { useFingerprint } from "@/hooks";
import CommentForm from "./CommentForm";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(date));
}

export default function CommentItem({ comment, recipeId, refresh, depth = 0 }: { comment: RecipeComment; recipeId: string; refresh: () => void; depth?: number }) {
    const [replyOpen, setReplyOpen] = useState(false);
    const fingerprint = useFingerprint();

    if (!comment) return null;

    const isPending = comment.status === "pending";

    async function handleLike() {
        await fetch("/api/comments", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                commentId: comment._id,
                author: "Anon",
                fingerprint,
            }),
        });

        refresh();
    }

    return (
        <Box ml={depth * 3}>
            <Box p={1}>
                <Typography variant="body2" mb={1}>
                    <strong>{comment.author}</strong> w dniu {formatDate(comment.createdAt)} napisał:
                </Typography>

                <Typography variant="body2" mb={1}>
                    {comment.content}
                </Typography>

                {isPending && (
                    <Typography variant="caption" color="warning.main">
                        Oczekuje na moderację...
                    </Typography>
                )}

                <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="Polub komentarz" arrow>
                        <IconButton
                            size="small"
                            color="primary"
                            disableRipple
                            onClick={handleLike}
                            sx={theme => ({
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.light, 0.2),
                                },
                            })}
                        >
                            <ThumbUpIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Typography variant="caption">{comment.likesCount}</Typography>

                    <Tooltip title="Odpowiedz na komentarz" arrow>
                        <IconButton
                            size="small"
                            color="primary"
                            disableRipple
                            onClick={() => setReplyOpen(v => !v)}
                            sx={theme => ({
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.light, 0.2),
                                },
                            })}
                        >
                            <ChatBubbleOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {replyOpen && (
                    <Box mt={1}>
                        <CommentForm
                            submitLabel="Odpowiedz"
                            onSubmit={async ({ author, content }) => {
                                await fetch("/api/comments", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        recipeId,
                                        parentId: comment._id,
                                        content,
                                        author,
                                        fingerprint,
                                    }),
                                });

                                setReplyOpen(false);
                                refresh();
                            }}
                        />
                    </Box>
                )}
            </Box>

            <Box mt={1} display="flex" flexDirection="column" gap={1}>
                {(comment.replies ?? []).filter(Boolean).map(reply => (
                    <CommentItem key={reply._id} comment={reply} recipeId={recipeId} refresh={refresh} depth={depth + 1} />
                ))}
            </Box>
        </Box>
    );
}
