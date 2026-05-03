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

import { useState } from "react";
import { alpha } from "@mui/material/styles";
import { Box, Typography, IconButton, Tooltip, Collapse } from "@mui/material";
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
    const [likes, setLikes] = useState<string[]>(comment.likes);
    const [isLiking, setIsLiking] = useState(false);
    const [animateLike, setAnimateLike] = useState(false);
    const fingerprint = useFingerprint();

    if (!comment) return null;

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
                            disabled={isLiking}
                            sx={theme => ({
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.light, 0.2),
                                },
                            })}
                        >
                            <ThumbUpIcon
                                fontSize="small"
                                sx={{
                                    color: alreadyLiked ? "success.main" : "action.active",
                                    transform: animateLike ? "scale(1.3)" : "scale(1)",
                                    transition: "transform 0.2s ease, color 0.2s ease",
                                    "@keyframes pop": {
                                        "0%": { transform: "scale(1)" },
                                        "50%": { transform: "scale(1.4)" },
                                        "100%": { transform: "scale(1)" },
                                    },
                                    animation: animateLike ? "pop 0.3s ease" : "none",
                                }}
                            />
                        </IconButton>
                    </Tooltip>

                    <Typography variant="caption">{likes.length}</Typography>

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

                <Collapse
                    in={replyOpen}
                    timeout={400}
                    sx={{ mt: 1 }}
                    easing={{
                        enter: "cubic-bezier(0.22, 1, 0.36, 1)",
                        exit: "cubic-bezier(0.4, 0, 1, 1)",
                    }}
                >
                    <Box>
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
                </Collapse>
            </Box>

            <Box mt={1} display="flex" flexDirection="column" gap={1}>
                {(comment.replies ?? []).filter(Boolean).map(reply => (
                    <CommentItem key={reply._id} comment={reply} recipeId={recipeId} refresh={refresh} depth={depth + 1} />
                ))}
            </Box>
        </Box>
    );
}
