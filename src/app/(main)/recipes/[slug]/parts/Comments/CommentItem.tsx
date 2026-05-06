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

import { Box, Typography } from "@mui/material";

import { RecipeComment } from "@/types";
import { useFingerprint } from "@/hooks";
import CommentForm from "./CommentForm";
import { LikeButton } from "./likeButton";
import { ReplyButton } from "./replyButton";
import ReplyCollapse from "./ReplyCollapse";

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
        }: {
            author: string;
            content: string;
            parentId?: string | null;
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
            </Box>

            <Box mt={1} display="flex" flexDirection="column" gap={1}>
                {(comment.replies ?? []).filter(Boolean).map(reply => (
                    <CommentItem key={reply._id} comment={reply} recipeId={recipeId} refresh={refresh} depth={depth + 1} handleAddComment={handleAddComment} />
                ))}
            </Box>
        </Box>
    );
}
