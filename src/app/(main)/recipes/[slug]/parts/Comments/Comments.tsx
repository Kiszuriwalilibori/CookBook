"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LoadingIndicator from "@/components/LoadingIndicator";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useIsAdminLogged } from "@/stores/useAdminStore";
import { useBoolean, useFingerprint, useMessage } from "@/hooks";
import type { ApiResponse, RecipeComment } from "@/types";
import { collapseSx, commentsContainerSx, commentsListSx, desktopCommentButtonWrapperSx, mobileCommentButtonSx, mobileCommentButtonWrapperSx, showMoreButtonWrapperSx } from "./commentStyles";
import { useScrollFocusOnOpen, useCreateCommentTree, useCommentsVisibility, handleApiError } from "./utils";
import { useCommentsState } from "./utils/useCommentsState";

export default function Comments({ recipeId }: { recipeId: string }) {
    const { comments, setAllComments, resetComments, addOptimisticComment, replaceOptimisticWithReal, removeOptimisticComment, isSubmittingComment, startSubmittingComment, stopSubmittingComment } = useCommentsState();
    const [accordionOpen, setAccordionOpen] = useState(true);
    const [isFormOpen, openForm, closeForm] = useBoolean(false);
    const isAdminLogged = useIsAdminLogged();
    const showMessage = useMessage();

    const openCommentForm = () => {
        openForm();
        setAccordionOpen(true);
    };
    const formContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fingerprint = useFingerprint();

    const handleAddComment = useCallback(
        async ({ author, content, parentId, website = "" }: { author: string; content: string; parentId?: string | null; website?: string }, options?: { onSuccess?: () => void; onError?: () => void }) => {
            const tempId = crypto.randomUUID();

            const optimisticComment: RecipeComment = {
                _id: tempId,
                recipeId,
                content,
                author,
                isAdmin: isAdminLogged,
                parentId: parentId ?? null,
                createdAt: new Date().toISOString(),
                fingerprint,
                likes: [],
            };
            startSubmittingComment();
            options?.onSuccess?.();
            addOptimisticComment(optimisticComment);

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
                        website: website || "",
                    }),
                });

                const data = await res.json();
                if (!data.ok) {
                    removeOptimisticComment(tempId);
                    handleApiError(
                        data.error,
                        {
                            COMMENT_COOLDOWN: msg => showMessage.warning(msg),
                            COMMENT_REJECTED: msg => showMessage.error(msg),
                            INTERNAL_ERROR: msg => showMessage.error(msg),
                            INVALID_PARENT: msg => showMessage.error(msg),
                        },
                        msg => showMessage.error(msg)
                    );
                } else {
                    const newComment = data.data.comment;

                    replaceOptimisticWithReal(tempId, newComment);
                    showMessage.success("Twój komentarz został dodany");
                }
            } catch (err) {
                showMessage.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
                removeOptimisticComment(tempId);
                options?.onError?.();
            } finally {
                stopSubmittingComment();
            }
        },
        [recipeId, fingerprint, addOptimisticComment, replaceOptimisticWithReal, removeOptimisticComment]
    );

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?recipeId=${recipeId}`);
            const data: ApiResponse<{ comments: RecipeComment[] }> = await res.json();
            if (!data.ok) {
                const error = data.error;
                switch (error.code) {
                    case "MISSING_RECIPE_ID":
                        showMessage.warning(error.message);
                        break;

                    case "FETCH_COMMENTS_FAILED":
                        showMessage.error(error.message);
                        break;

                    default:
                        showMessage.error(error.message || "Wystąpił nieznany błąd");
                }

                resetComments();
                return;
            }
            const safeComments: RecipeComment[] = Array.isArray(data.data.comments) ? data.data.comments.filter(Boolean) : [];

            setAllComments(safeComments);
        } catch (err) {
            console.error("[COMMENTS][GET]", {
                error: err,
                recipeId,
            });
            resetComments();
            showMessage.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
        }
    }, [recipeId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useScrollFocusOnOpen({
        isOpen: isFormOpen,
        ref: formContainerRef,
        inputRef: textareaRef,
    });
    const isLoading = comments === null;
    const { commentTree, commentsCount } = useCreateCommentTree(comments);
    const { visibleItems, viewMode, toggleCommentsVisibility, buttonLabel, hasAny } = useCommentsVisibility(commentTree, 3);

    return (
        <>
            <Box id="comments">
                <LoadingIndicator open={isSubmittingComment} prompt="Dodawanie komentarza w toku" />
                <Accordion expanded={accordionOpen} onChange={(_, expanded) => setAccordionOpen(expanded)} elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">Komentarze ({commentsCount})</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        {/* FORM */}
                        <Box ref={formContainerRef}>
                            <Collapse in={isFormOpen} timeout={400} sx={collapseSx}>
                                <CommentForm
                                    textAreaRef={textareaRef}
                                    submitLabel="Dodaj"
                                    onSubmitNormalComment={async data => {
                                        closeForm();
                                        await handleAddComment(data);
                                    }}
                                    onCancel={() => closeForm()}
                                />
                            </Collapse>
                        </Box>

                        {isLoading ? (
                            <LoadingIndicator open={isLoading} prompt="Trwa pobieranie komentarzy" />
                        ) : (
                            <Box sx={commentsContainerSx}>
                                {/* FIRST COMMENTS */}
                                <Box key={viewMode} sx={commentsListSx}>
                                    {visibleItems.map(comment => (
                                        <CommentItem key={comment._id} comment={comment} recipeId={recipeId} handleAddComment={handleAddComment} />
                                    ))}
                                </Box>

                                {/* MORE BUTTON */}
                                {hasAny && (
                                    <Box sx={showMoreButtonWrapperSx}>
                                        <Button variant="contained" onClick={toggleCommentsVisibility}>
                                            {buttonLabel}
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* 🔥 MOBILE STICKY CTA */}
            <Box sx={mobileCommentButtonWrapperSx}>
                <Button sx={mobileCommentButtonSx} variant="contained" color="primary" onClick={openCommentForm}>
                    Dodaj komentarz
                </Button>
            </Box>

            {/* 🔥 DESKTOP FLOATING CTA */}
            <Box sx={desktopCommentButtonWrapperSx}>
                <Button variant="contained" color="primary" startIcon={<ChatBubbleOutlineIcon />} onClick={openCommentForm}>
                    Skomentuj
                </Button>
            </Box>
        </>
    );
}
