"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CommentItem from "./CommentItem";
import { buildCommentTree } from "@/utils/buildCommentTree";
import type { RecipeComment } from "@/types";

/**
 * 🔥 Optimistic extension
 */
type OptimisticComment = RecipeComment & {
    _temp?: boolean;
};

function createTempComment(data: { content: string; author: string; recipeId: string }): OptimisticComment {
    return {
        _id: crypto.randomUUID(),
        recipeId: data.recipeId,
        content: data.content,
        author: data.author,

        parentId: null,
        createdAt: new Date().toISOString(),

        fingerprint: "",
        status: "approved",
        likes: [],
        likesCount: 0,

        _temp: true,
    };
}

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<OptimisticComment[] | null>(null);

    const [newComment, setNewComment] = useState("");
    const [author, setAuthor] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [error, setError] = useState("");

    // ✅ FIX: memoized fetch to satisfy ESLint + avoid stale closure issues
    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?recipeId=${recipeId}`);
            const data = await res.json();

            const safeComments: OptimisticComment[] = Array.isArray(data.comments) ? data.comments.filter(Boolean) : [];

            setComments(safeComments);
        } catch {
            setComments([]);
        }
    }, [recipeId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const isLoading = comments === null;

    const safeFlatComments = (comments ?? []).filter(c => !c._temp);
    const commentTree = buildCommentTree(safeFlatComments);

    async function handleAddComment() {
        if (!newComment.trim() || !author.trim()) {
            setError("Musisz wypełnić oba pola.");
            return;
        }

        setError("");

        const tempComment = createTempComment({
            content: newComment,
            author,
            recipeId,
        });

        // 🔥 OPTIMISTIC UPDATE
        setComments(prev => {
            const safe = prev ?? [];
            return [tempComment, ...safe];
        });

        setNewComment("");
        setAuthor("");
        setFormOpen(false);

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId,
                    content: tempComment.content,
                    author: tempComment.author,
                    fingerprint: crypto.randomUUID(),
                }),
            });

            const data = await res.json();

            if (!data.ok) {
                throw new Error("Rejected");
            }

            const realComment: OptimisticComment = data.comment;

            // 🔥 REPLACE TEMP → REAL
            setComments(prev => (prev ?? []).map(c => (c._id === tempComment._id ? realComment : c)));
        } catch {
            // 🔥 ROLLBACK
            setComments(prev => (prev ?? []).filter(c => c._id !== tempComment._id));

            setError("Komentarz został odrzucony przez moderację.");
        }
    }

    return (
        <Accordion defaultExpanded={false} elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">Komentarze ({safeFlatComments.length})</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Button onClick={() => setFormOpen(v => !v)} sx={{ mb: 2 }}>
                    {formOpen ? "Anuluj" : "Dodaj komentarz"}
                </Button>

                {formOpen && (
                    <>
                        {error && (
                            <Typography color="error" sx={{ mb: 1 }}>
                                {error}
                            </Typography>
                        )}

                        <TextField
                            fullWidth
                            size="small"
                            label="Imię"
                            value={author}
                            onChange={e => {
                                setAuthor(e.target.value);
                                setError("");
                            }}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            size="small"
                            label="Komentarz"
                            value={newComment}
                            onChange={e => {
                                setNewComment(e.target.value);
                                setError("");
                            }}
                            sx={{ mb: 2 }}
                        />

                        <Button variant="contained" onClick={handleAddComment} disabled={!author.trim() || !newComment.trim()}>
                            Dodaj
                        </Button>
                    </>
                )}

                {isLoading ? (
                    <Box>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} height={60} />
                        ))}
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {commentTree.map(comment => (
                            <CommentItem key={comment._id} comment={comment} recipeId={recipeId} refresh={fetchComments} />
                        ))}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
}
