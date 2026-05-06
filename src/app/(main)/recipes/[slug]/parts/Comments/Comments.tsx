"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { buildCommentTree } from "@/utils/buildCommentTree";
import { useFingerprint } from "@/hooks";
import type { RecipeComment } from "@/types";
import { collapseSx } from "./commentStyles";

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<RecipeComment[] | null>(null);
    const [formOpen, setFormOpen] = useState(false);

    const [expanded, setExpanded] = useState(false);
    const [hasExpandedOnce, setHasExpandedOnce] = useState(false);

    const fingerprint = useFingerprint();

    const handleAddComment = useCallback(
        async ({ author, content, parentId }: { author: string; content: string; parentId?: string | null }, options?: { onSuccess?: () => void; onError?: () => void }) => {
            const tempId = crypto.randomUUID();

            const optimisticComment: RecipeComment = {
                _id: tempId,
                recipeId,
                content,
                author,
                parentId: parentId ?? null,
                createdAt: new Date().toISOString(),
                fingerprint: "",
                status: "approved",
                likes: [],
            };

            options?.onSuccess?.();
            setComments(prev => [optimisticComment, ...(prev ?? [])]);

            try {
                const res = await fetch("/api/comments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        recipeId,
                        content,
                        author,
                        parentId: parentId ?? null,
                        fingerprint,
                        website: "",
                    }),
                });

                const data = await res.json();
                if (!data.ok) throw new Error();

                setComments(prev => (prev ?? []).map(c => (c._id === tempId ? data.comment : c)));
            } catch (err) {
                console.error("[COMMENTS][POST]", err);
                setComments(prev => (prev ?? []).filter(c => c._id !== tempId));
                options?.onError?.();
            }
        },
        [recipeId, fingerprint]
    );

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?recipeId=${recipeId}`);
            const data = await res.json();

            const safeComments: RecipeComment[] = Array.isArray(data.comments) ? data.comments.filter(Boolean) : [];

            setComments(safeComments);
        } catch (err) {
            console.error("[COMMENTS][FETCH]", err);
            setComments([]);
        }
    }, [recipeId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const isLoading = comments === null;
    const safeFlatComments = comments ?? [];
    const commentTree = buildCommentTree(safeFlatComments);

    const hasMore = commentTree.length > 3;

    return (
        <Accordion defaultExpanded elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">Komentarze ({safeFlatComments.length})</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Button onClick={() => setFormOpen(true)} sx={{ mb: 2, visibility: formOpen ? "hidden" : "visible" }}>
                    {formOpen ? "Anuluj" : "Dodaj komentarz"}
                </Button>

                <Collapse in={formOpen} timeout={400} sx={collapseSx}>
                    <CommentForm
                        key={formOpen ? "open" : "closed"}
                        submitLabel="Dodaj"
                        onSubmit={async data => {
                            setFormOpen(false);
                            await handleAddComment(data);
                        }}
                        onCancel={() => setFormOpen(false)}
                    />
                </Collapse>

                {isLoading ? (
                    <Box>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} height={60} />
                        ))}
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {/* 🔹 pierwsze 3 tylko na starcie */}
                        <Collapse in={!expanded && !hasExpandedOnce}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                {commentTree.slice(0, 3).map(comment => (
                                    <CommentItem key={comment._id} comment={comment} recipeId={recipeId} refresh={fetchComments} handleAddComment={handleAddComment} />
                                ))}
                            </Box>
                        </Collapse>

                        {/* 🔹 wszystkie */}
                        <Collapse in={expanded}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                {commentTree.map(comment => (
                                    <CommentItem key={comment._id} comment={comment} recipeId={recipeId} refresh={fetchComments} handleAddComment={handleAddComment} />
                                ))}
                            </Box>
                        </Collapse>

                        {/* 🔹 button */}
                        {hasMore && (
                            <Box textAlign="center">
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => {
                                        if (!expanded) {
                                            setExpanded(true);
                                            setHasExpandedOnce(true);
                                        } else {
                                            setExpanded(false);
                                        }
                                    }}
                                >
                                    {expanded ? "Zwiń komentarze" : hasExpandedOnce ? "Pokaż wszystkie" : `Pokaż więcej (${commentTree.length - 3})`}
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
}
