"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CommentItem from "./CommentItem";
import { buildCommentTree } from "@/utils/buildCommentTree";
import type { RecipeComment } from "@/types";

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<RecipeComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [author, setAuthor] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function fetchComments() {
        setLoading(true);

        const res = await fetch(`/api/comments?recipeId=${recipeId}`);
        const data = await res.json();

        setComments(data.comments || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchComments();
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
        fetchComments();
    }

    const tree = buildCommentTree(comments);

    return (
        <Accordion
            defaultExpanded={false}
            elevation={0}
            sx={{
                border: "none",
                "&:before": {
                    display: "none",
                },
            }}
        >
            {/* HEADER */}
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">Komentarze {loading ? "" : `(${comments.length})`}</Typography>
            </AccordionSummary>

            {/* CONTENT */}
            <AccordionDetails>
                {/* LOADING */}
                {loading && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Ładowanie komentarzy...
                    </Typography>
                )}

                {/* ADD COMMENT BUTTON */}
                <Button variant="outlined" size="small" onClick={() => setFormOpen(!formOpen)} sx={{ mb: 2 }}>
                    {formOpen ? "Anuluj" : "Dodaj komentarz"}
                </Button>

                {/* FORM */}
                {formOpen && (
                    <>
                        {/* ERROR */}
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                                {error}
                            </Typography>
                        )}

                        {/* AUTHOR */}
                        <TextField
                            fullWidth
                            size="small"
                            label="Przedstaw się *"
                            value={author}
                            onChange={e => {
                                setAuthor(e.target.value);
                                setError("");
                            }}
                            error={!author.trim() && !!error}
                            sx={{ mb: 2 }}
                        />

                        {/* COMMENT */}
                        <TextField
                            fullWidth
                            size="small"
                            label="Wpisz komentarz *"
                            value={newComment}
                            onChange={e => {
                                setNewComment(e.target.value);
                                setError("");
                            }}
                            error={!newComment.trim() && !!error}
                            sx={{ mb: 2 }}
                        />

                        {/* BUTTON */}
                        <Box display="flex" gap={1} mb={3}>
                            <Button variant="contained" onClick={handleAddComment} disabled={!author.trim() || !newComment.trim()}>
                                Dodaj
                            </Button>
                        </Box>
                    </>
                )}

                {/* COMMENTS TREE */}
                {!loading && (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {tree.map(c => (
                            <CommentItem key={c._id} comment={c} recipeId={recipeId} refresh={fetchComments} />
                        ))}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
}
