"use client";

import { useState, useCallback, useRef } from "react";

import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";

import LoadingIndicator from "@/components/LoadingIndicator";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm/CommentForm";

import { useIsAdminLogged } from "@/stores/useAdminStore";

import { useBoolean, useFingerprint, useMessage, useApiResponseErrorHandler } from "@/hooks";

import type { RecipeComment } from "@/types";

import { commentsContainerSx, commentsListSx, desktopCommentButtonWrapperSx, mobileCommentButtonSx, mobileCommentButtonWrapperSx, showMoreButtonWrapperSx } from "./Comment.styles";

import { useCreateCommentTree, useCommentsVisibility } from "./utils";

import { useCommentsState } from "./utils/useCommentsState";
import { useCommentsSorting } from "./utils/useCommentsSorting";

import { ApiResponse } from "@/models/apiResponse";

interface CommentsProps {
    recipeId: string;
    initialComments: RecipeComment[];
    totalComments: number;
    totalThreads: number;
}

export default function Comments({ recipeId, initialComments, totalComments: initialTotalComments, totalThreads: initialTotalThreads }: CommentsProps) {
    const { comments, setAllComments, addOptimisticComment, replaceOptimisticWithReal, removeOptimisticComment, isSubmittingComment, startSubmittingComment, stopSubmittingComment } = useCommentsState(initialComments);

    const [accordionOpen, setAccordionOpen] = useState(true);

    const [isFormOpen, openForm, closeForm] = useBoolean(false);

    const [isFullListLoaded, setIsFullListLoaded] = useState(false);
    const [isLoadingAllComments, setIsLoadingAllComments] = useState(false);
    const [loadAllCommentsError, setLoadAllCommentsError] = useState(false);

    const [totalComments, setTotalComments] = useState(initialTotalComments);
    const [totalThreads, setTotalThreads] = useState(initialTotalThreads);

    const isAdminLogged = useIsAdminLogged();

    const showMessage = useMessage();

    const handleApiResponseError = useApiResponseErrorHandler();

    const { sortMode, setSortMode, sortedComments } = useCommentsSorting(comments);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const fingerprint = useFingerprint();

    const openCommentForm = () => {
        openForm();
        setAccordionOpen(true);
    };

    const handleAddComment = useCallback(
        async (
            {
                author,
                content,
                parentId,
                website = "",
            }: {
                author: string;
                content: string;
                parentId?: string | null;
                website?: string;
            },
            options?: {
                onSuccess?: () => void;
                onError?: () => void;
            }
        ) => {
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
                    headers: {
                        "Content-Type": "application/json",
                    },
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

                    handleApiResponseError(data.error, {
                        COMMENT_COOLDOWN: {
                            type: "warning",
                        },
                        COMMENT_REJECTED: {
                            type: "error",
                        },
                        INTERNAL_ERROR: {
                            type: "error",
                        },
                        INVALID_PARENT: {
                            type: "error",
                        },
                    });
                } else {
                    const newComment = data.data.comment;

                    replaceOptimisticWithReal(tempId, newComment);
                    setTotalComments(prev => prev + 1);

                    if (!newComment.parentId) {
                        setTotalThreads(prev => prev + 1);
                    }

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
        [recipeId, fingerprint, isAdminLogged, addOptimisticComment, replaceOptimisticWithReal, removeOptimisticComment, startSubmittingComment, stopSubmittingComment, handleApiResponseError, showMessage]
    );

    const fetchComments = useCallback(async (): Promise<boolean> => {
        if (isFullListLoaded) {
            return true;
        }

        if (isLoadingAllComments) {
            return false;
        }

        setIsLoadingAllComments(true);
        setLoadAllCommentsError(false);

        try {
            const res = await fetch(`/api/comments?recipeId=${encodeURIComponent(recipeId)}`);

            if (!res.ok) {
                throw new Error("Nie udało się pobrać wszystkich komentarzy.");
            }

            const data: ApiResponse<{
                comments: RecipeComment[];
            }> = await res.json();

            if (!data.ok) {
                throw new Error(data.error.message || "Nie udało się pobrać wszystkich komentarzy.");
            }

            const safeComments: RecipeComment[] = Array.isArray(data.data.comments) ? data.data.comments.filter(Boolean) : [];

            setAllComments(safeComments);

            setTotalComments(safeComments.length);

            setTotalThreads(safeComments.filter(comment => !comment.parentId).length);

            setIsFullListLoaded(true);

            return true;
        } catch (err) {
            console.error("[COMMENTS][GET]", {
                error: err,
                recipeId,
            });

            setLoadAllCommentsError(true);

            showMessage.error(err instanceof Error ? err.message : "Nie udało się pobrać wszystkich komentarzy.");

            return false;
        } finally {
            setIsLoadingAllComments(false);
        }
    }, [recipeId, isFullListLoaded, isLoadingAllComments, setAllComments, showMessage]);

    const commentsForTree = isFullListLoaded ? sortedComments : comments;

    const { commentTree } = useCreateCommentTree(commentsForTree);

    const initialRootCount = initialComments.filter(comment => !comment.parentId).length;

    const currentRootCount = comments.filter(comment => !comment.parentId).length;
    const displayedTotalComments = totalComments;
    const displayedTotalThreads = isFullListLoaded ? totalThreads : initialTotalThreads + Math.max(0, currentRootCount - initialRootCount);

    const { visibleItems, viewMode, toggleCommentsVisibility, buttonLabel, hasAny } = useCommentsVisibility(commentTree, 3, displayedTotalThreads);

    const handleToggleCommentsVisibility = async () => {
        if (viewMode === "preview" && !isFullListLoaded) {
            const loaded = await fetchComments();

            if (!loaded) {
                return;
            }
        }

        toggleCommentsVisibility();
    };

    if (!fingerprint) {
        return null;
    }

    return (
        <>
            <Box id="comments">
                <LoadingIndicator open={isSubmittingComment} prompt="Dodawanie komentarza w toku" />

                <Accordion expanded={accordionOpen} onChange={(_, expanded) => setAccordionOpen(expanded)} elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">Komentarze ({displayedTotalComments})</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Box sx={commentsContainerSx}>
                            {isLoadingAllComments && <LoadingIndicator open={isLoadingAllComments} prompt="Trwa pobieranie wszystkich komentarzy" />}

                            <Box
                                onClick={event => event.stopPropagation()}
                                sx={{
                                    margin: "0 auto",
                                    display: "flex",
                                    gap: 2,
                                    px: 1,
                                    py: 1,
                                    minHeight: 56,
                                    boxSizing: "border-box",
                                    visibility: isFullListLoaded ? "visible" : "hidden",
                                }}
                                aria-hidden={!isFullListLoaded}
                            >
                                <Button size="small" color="secondary" variant={sortMode === "newest" ? "contained" : "outlined"} onClick={() => setSortMode("newest")} tabIndex={isFullListLoaded ? 0 : -1}>
                                    Najnowsze
                                </Button>

                                <Button size="small" color="secondary" variant={sortMode === "most_liked" ? "contained" : "outlined"} onClick={() => setSortMode("most_liked")} tabIndex={isFullListLoaded ? 0 : -1}>
                                    Polubienia
                                </Button>

                                <Button size="small" color="secondary" variant={sortMode === "my_comments" ? "contained" : "outlined"} onClick={() => setSortMode("my_comments")} tabIndex={isFullListLoaded ? 0 : -1}>
                                    Moje
                                </Button>
                            </Box>

                            <Box key={viewMode} sx={commentsListSx}>
                                {visibleItems.map(comment => (
                                    <CommentItem key={comment._id} comment={comment} recipeId={recipeId} handleAddComment={handleAddComment} />
                                ))}
                            </Box>

                            {hasAny && (
                                <Box sx={showMoreButtonWrapperSx}>
                                    <Button variant="contained" color="secondary" onClick={handleToggleCommentsVisibility} disabled={isLoadingAllComments}>
                                        {loadAllCommentsError && !isFullListLoaded ? "Spróbuj ponownie" : buttonLabel}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* ADD NEW COMMENT DIALOG */}
            <Dialog open={isFormOpen} onClose={closeForm} fullWidth maxWidth="sm" aria-labelledby="add-comment-dialog-title">
                <DialogTitle
                    id="add-comment-dialog-title"
                    sx={{
                        pr: 6,
                    }}
                >
                    Dodaj komentarz
                    <IconButton
                        aria-label="Zamknij formularz komentarza"
                        onClick={closeForm}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <CommentForm
                        textAreaRef={textareaRef}
                        renderAsModal
                        submitLabel="Dodaj"
                        onSubmitNormalComment={async data => {
                            closeForm();
                            await handleAddComment(data);
                        }}
                        onCancel={closeForm}
                    />
                </DialogContent>
            </Dialog>

            {/* MOBILE STICKY CTA */}
            {!isFormOpen && (
                <Box sx={mobileCommentButtonWrapperSx}>
                    <Button sx={mobileCommentButtonSx} variant="contained" color="primary" onClick={openCommentForm}>
                        Dodaj komentarz
                    </Button>
                </Box>
            )}

            {/* DESKTOP FLOATING CTA */}
            {!isFormOpen && (
                <Box sx={desktopCommentButtonWrapperSx}>
                    <Button variant="contained" color="primary" startIcon={<ChatBubbleOutlineIcon />} onClick={openCommentForm}>
                        Skomentuj
                    </Button>
                </Box>
            )}
        </>
    );
}
