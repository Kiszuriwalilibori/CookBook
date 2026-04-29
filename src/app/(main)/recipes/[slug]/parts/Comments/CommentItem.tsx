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

//todo Jeśli chcesz, mogę Ci dorzucić wersję z optimistic updates pod Twój konkretny stan komentarzy.Ta uwaga dotyczy useDebounceCallback.

// TODO:Opcjonalne ulepszenie (polecane)

// Jeśli chcesz UX na poziomie „pro”:

// Optimistic update + debounce request

// Czyli:

// natychmiast zwiększasz licznik w UI
// debounce wysyła request
// w razie błędu rollback

// To eliminuje „lag kliknięcia”. komentarze od todo dotyczą sytuacji po wstawieniu debounced
//todo: Jeśli chcesz,
// mogę Ci jeszcze pokazać upgrade, który rozwiązuje większy problem architektoniczny tutaj:

// 👉
// debounce + optimistic update + refresh bez race condition
// bo przy like/unlike w React + fetch możesz mieć subtelne bugi przy szybkich klikach.
"use client";

import { useState, useEffect } from "react";
import { alpha } from "@mui/material/styles";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import { RecipeComment } from "@/types";
import { useFingerprint } from "@/hooks";
import CommentForm from "./CommentForm";
import { useDebouncedCallback } from "@/hooks/useDebounceCallback";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(date));
}

export default function CommentItem({ comment, recipeId, refresh, depth = 0 }: { comment: RecipeComment; recipeId: string; refresh: () => void; depth?: number }) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [likesCount, setLikesCount] = useState(comment.likes.length);
    console.log("comment.likes fresh from CommentItem as prop", comment.likes);
    const likes = comment.likes;
    useEffect(() => {
        setLikesCount(likes.length);
    }, [JSON.stringify(likes)]);

    const fingerprint = useFingerprint();
    const { callback: debouncedLike } = useDebouncedCallback(handleLike, {
        delay: 400,
        leading: false, // lub true jeśli chcesz natychmiastowy efekt
    });

    if (!comment) return null;

    const isPending = comment.status === "pending";

    async function handleLike() {
        const alreadyLiked = comment.likes.some(like => like.fingerprint === fingerprint);
        // 🔥 optimistic update
        console.log("alreadyLiked", alreadyLiked);
        // setLikesCount(prev => (alreadyLiked ? prev - 1 : prev + 1));
        setLikesCount(prev => (alreadyLiked ? comment.likes.length - 1 : comment.likes.length + 1));
        try {
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
        } catch (err) {
            console.error("[LIKE][ERROR]", err);

            // rollback (minimalny)
            setLikesCount(prev => (alreadyLiked ? prev + 1 : prev - 1));
        }
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
                            onClick={debouncedLike}
                            sx={theme => ({
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.light, 0.2),
                                },
                            })}
                        >
                            <ThumbUpIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Typography variant="caption">{likesCount}</Typography>

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
