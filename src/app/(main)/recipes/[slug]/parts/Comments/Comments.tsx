"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { buildCommentTree } from "@/utils/buildCommentTree";
import { useFingerprint, useMessage } from "@/hooks";
import type { RecipeComment } from "@/types";
import { collapseSx, commentsContainerSx, commentsListSx, desktopCommentButtonWrapperSx, mobileCommentButtonWrapperSx, showMoreButtonWrapperSx } from "./commentStyles";
import { useCommentsVisibility } from "./utils/useCommentsVisibility";

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<RecipeComment[] | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const showMessage = useMessage();

    const formRef = useRef<HTMLDivElement | null>(null);

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
                // 🔥 NOWE: zbyt szybkie próby
                if (res.status === 429 || data?.reason === "Too soon") {
                    showMessage.warning("Dodajesz komentarze zbyt szybko. Spróbuj ponownie za chwilę.");
                    setComments(prev => (prev ?? []).filter(c => c._id !== tempId));
                    options?.onError?.();
                    return;
                }
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

    // 🔥 scroll + autofocus after opening form
    useEffect(() => {
        if (formOpen && formRef.current) {
            formRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            setTimeout(() => {
                const input = formRef.current?.querySelector("input, textarea") as HTMLElement | null;

                input?.focus();
            }, 300);
        }
    }, [formOpen]);

    const isLoading = comments === null;
    const safeFlatComments = comments ?? [];
    const commentTree = buildCommentTree(safeFlatComments);
    const { visibleItems, viewMode, toggleCommentsVisibility, buttonLabel, hasAny } = useCommentsVisibility(commentTree, 3);

    return (
        <>
            <Box id="comments">
                <Accordion defaultExpanded elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">Komentarze ({safeFlatComments.length})</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        {/* FORM */}
                        <Box ref={formRef}>
                            <Collapse in={formOpen} timeout={400} sx={collapseSx}>
                                <CommentForm
                                    submitLabel="Dodaj"
                                    onSubmit={async data => {
                                        setFormOpen(false);
                                        await handleAddComment(data);
                                    }}
                                    onCancel={() => setFormOpen(false)}
                                />
                            </Collapse>
                        </Box>

                        {isLoading ? (
                            <Box>
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} height={60} />
                                ))}
                            </Box>
                        ) : (
                            <Box sx={commentsContainerSx}>
                                {/* FIRST COMMENTS */}
                                <Box key={viewMode} sx={commentsListSx}>
                                    {visibleItems.map(comment => (
                                        <CommentItem key={comment._id} comment={comment} recipeId={recipeId} refresh={fetchComments} handleAddComment={handleAddComment} />
                                    ))}
                                </Box>

                                {/* MORE BUTTON */}
                                {hasAny && (
                                    <Box sx={showMoreButtonWrapperSx}>
                                        <Button onClick={toggleCommentsVisibility}>{buttonLabel}</Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* 🔥 MOBILE STICKY CTA */}
            <Box sx={mobileCommentButtonWrapperSx}>
                <Button variant="contained" color="primary" onClick={() => setFormOpen(true)}>
                    Dodaj komentarz
                </Button>
            </Box>

            {/* 🔥 DESKTOP FLOATING CTA */}
            <Box sx={desktopCommentButtonWrapperSx}>
                <Button variant="contained" color="primary" startIcon={<ChatBubbleOutlineIcon />} onClick={() => setFormOpen(true)}>
                    Skomentuj
                </Button>
            </Box>
        </>
    );
}
