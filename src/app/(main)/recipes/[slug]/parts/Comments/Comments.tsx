"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CommentItem from "./CommentItem";
import { buildCommentTree } from "@/utils/buildCommentTree";
import type { RecipeComment } from "@/types";

// 🔥 SANITY LISTEN
import { createClient } from "@sanity/client";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2024-10-14",
    useCdn: false,
});

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<RecipeComment[] | null>(null);

    const [newComment, setNewComment] = useState("");
    const [author, setAuthor] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [error, setError] = useState("");

    async function fetchComments() {
        try {
            const res = await fetch(`/api/comments?recipeId=${recipeId}`);
            const data = await res.json();

            const safeComments: RecipeComment[] = Array.isArray(data.comments) ? data.comments.filter(Boolean) : [];

            setComments(safeComments);
        } catch (err) {
            console.error("[COMMENTS] fetch error", err);
            setComments([]);
        }
    }

    useEffect(() => {
        fetchComments();
    }, [recipeId]);

    // 🔥 REALTIME SYNC
    useEffect(() => {
        if (!recipeId) return;

        const query = `*[_type=="recipeComment" && recipeId==$recipeId]`;
        const params = { recipeId };

        const subscription = client.listen(query, params, { includeResult: true }).subscribe(update => {
            console.log("[SANITY LISTEN]", update);

            // 🔥 zawsze sync z backendem
            fetchComments();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [recipeId]);

    async function handleAddComment() {
        if (!newComment.trim() || !author.trim()) {
            setError("Musisz wypełnić oba pola aby dodać komentarz.");
            return;
        }

        setError("");

        await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recipeId,
                content: newComment,
                author,
                fingerprint: crypto.randomUUID(),
            }),
        });

        setNewComment("");
        setAuthor("");
        setFormOpen(false);

        // ❗ brak timeoutów / pollingu — listen ogarnia wszystko
    }

    const isLoading = comments === null;

    const safeFlatComments = (comments ?? []).filter(Boolean);
    const commentTree = buildCommentTree(safeFlatComments);

    return (
        <Accordion
            defaultExpanded={false}
            elevation={0}
            sx={{
                border: "none",
                "&:before": { display: "none" },
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">Komentarze ({safeFlatComments.length})</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Button variant="text" size="small" onClick={() => setFormOpen(!formOpen)} sx={{ mb: 2 }}>
                    {formOpen ? "Anuluj" : "Dodaj komentarz"}
                </Button>

                {formOpen && (
                    <>
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                                {error}
                            </Typography>
                        )}

                        <TextField
                            fullWidth
                            size="small"
                            label="Przedstaw się *"
                            value={author}
                            onChange={e => {
                                setAuthor(e.target.value);
                                setError("");
                            }}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Wpisz komentarz *"
                            value={newComment}
                            onChange={e => {
                                setNewComment(e.target.value);
                                setError("");
                            }}
                            multiline
                            minRows={3}
                            sx={{ mb: 2 }}
                        />

                        <Box display="flex" gap={1} mb={3}>
                            <Button variant="contained" onClick={handleAddComment} disabled={!author.trim() || !newComment.trim()}>
                                Dodaj
                            </Button>
                        </Box>
                    </>
                )}

                {isLoading ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {[1, 2, 3].map(i => (
                            <Box key={i}>
                                <Skeleton variant="text" width="30%" />
                                <Skeleton variant="rectangular" height={60} />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {commentTree.map(commentNode => (
                            <CommentItem key={commentNode._id} comment={commentNode} recipeId={recipeId} refresh={fetchComments} />
                        ))}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
}
