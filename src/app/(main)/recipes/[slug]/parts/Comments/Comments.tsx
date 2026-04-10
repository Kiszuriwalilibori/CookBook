"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import CommentItem from "./CommentItem";

import { buildCommentTree } from "@/utils/buildCommentTree";
import { RecipeComment } from "@/types";

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<RecipeComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [author, setAuthor] = useState("");

    async function fetchComments() {
        const res = await fetch(`/api/comments?recipeId=${recipeId}`);
        const data = await res.json();

        setComments(data.comments || []);
    }

    useEffect(() => {
        fetchComments();
    }, [recipeId]);

    async function handleAddComment() {
        if (!newComment.trim() || !author.trim()) return;

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
        fetchComments();
    }

    const tree = buildCommentTree(comments);

    return (
        <Box>
            <Typography variant="h5" mb={2}>
                Komentarze
            </Typography>

            {/* AUTHOR */}
            <TextField fullWidth size="small" placeholder="Twój nick" value={author} onChange={e => setAuthor(e.target.value)} sx={{ mb: 1 }} />

            {/* INPUT */}
            <Box display="flex" gap={1} mb={3}>
                <TextField fullWidth size="small" placeholder="Dodaj komentarz..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                <Button variant="contained" onClick={handleAddComment}>
                    Dodaj
                </Button>
            </Box>

            {/* TREE RENDER */}
            <Box display="flex" flexDirection="column" gap={2}>
                {tree.map(c => (
                    <CommentItem key={c._id} comment={c} recipeId={recipeId} refresh={fetchComments} />
                ))}
            </Box>
        </Box>
    );
}
