"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CommentItem from "./CommentItem";
import { buildCommentTree} from "@/utils/buildCommentTree";
import type { RecipeComment } from "@/types";

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<RecipeComment[] | null>(null);
    
    const [newComment, setNewComment] = useState("");
    const [author, setAuthor] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [error, setError] = useState("");

    async function fetchComments() {
        const res = await fetch(`/api/comments?recipeId=${recipeId}`);
        const data = await res.json();
        setComments(data.comments || []);
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

    const isLoading = comments === null;
    const commentTree = buildCommentTree(comments || []);
    const commentCount = comments?.length ?? null;

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
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">
                    Komentarze
                    {commentCount !== null ? ` (${commentCount})` : ""}
                </Typography>
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
                            error={!author.trim() && !!error}
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
                            error={!newComment.trim() && !!error}
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