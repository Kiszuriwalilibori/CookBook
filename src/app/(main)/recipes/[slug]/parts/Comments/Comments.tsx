"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Skeleton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LoadingIndicator from "@/components/LoadingIndicator";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { buildCommentTree } from "@/utils/buildCommentTree";
import { useFingerprint, useMessage } from "@/hooks";
import type { RecipeComment } from "@/types";
import { collapseSx, commentsContainerSx, commentsListSx, desktopCommentButtonWrapperSx, mobileCommentButtonSx, mobileCommentButtonWrapperSx, showMoreButtonWrapperSx } from "./commentStyles";
import { useCommentsVisibility } from "./utils/useCommentsVisibility";
import { handleApiError } from "./utils/handleError";

export default function Comments({ recipeId }: { recipeId: string }) {
    const [comments, setComments] = useState<RecipeComment[] | null>(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const showMessage = useMessage();

    const openCommentForm = () => {
        setFormOpen(true);

        setAccordionOpen(true);
    };

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
                likes: [],
            };
            setIsSubmittingComment(true);
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
                if (!data.ok) {
                    setComments(prev => (prev ?? []).filter(c => c._id !== tempId));
                    handleApiError(
                        data.error,
                        {
                            COMMENT_COOLDOWN: msg => showMessage.warning(msg),
                            COMMENT_REJECTED: msg => showMessage.error(msg),
                            INTERNAL_ERROR: msg => showMessage.error(msg),
                        },
                        msg => showMessage.error(msg)
                    );
                } else {
                    setComments(prev => (prev ?? []).map(c => (c._id === tempId ? data.comment : c)));
                    showMessage.success("Twój komentarz został dodany");
                }
            } catch (err) {
                showMessage.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
                setComments(prev => (prev ?? []).filter(c => c._id !== tempId));

                options?.onError?.();
            } finally {
                setIsSubmittingComment(false);
            }
        },
        [recipeId, fingerprint]
    );
    // const handleAddShortComment = useCallback(
    //     async (data: { commentId: string; shortContent: string }) => {
    //         const { commentId, shortContent } = data;

    //         if (!commentId || !shortContent?.trim()) {
    //             showMessage.warning("Brak treści skróconego komentarza");
    //             return false;
    //         }

    //         setIsSubmittingComment(true);

    //         try {
    //             const res = await fetch("/api/comments", {
    //                 method: "PATCH",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({
    //                     commentId,
    //                     shortContent: shortContent.trim(),
    //                     option: "HANDLE_SHORT_COMMENT",
    //                 }),
    //             });

    //             const responseData = await res.json();

    //             if (!responseData.ok) {
    //                 handleApiError(
    //                     responseData.error,
    //                     {
    //                         FORBIDDEN: () => showMessage.error("Brak uprawnień administratora"),
    //                         INVALID_INPUT: () => showMessage.warning("Nieprawidłowe dane"),
    //                         EMPTY_SHORT_COMMENT: () => showMessage.warning("Skrócony komentarz nie może być pusty"),
    //                         SHORT_COMMENT_TOO_LONG: () => showMessage.warning("Skrócony komentarz jest za długi"),
    //                         COMMENT_NOT_FOUND: () => showMessage.warning("Komentarz nie został znaleziony"),
    //                     },
    //                     msg => showMessage.error(msg || "Nie udało się dodać skróconego komentarza")
    //                 );
    //                 return false;
    //             }

    //             // Aktualizacja lokalnego stanu
    //             setComments(prev => (prev ?? []).map(c => (c._id === commentId ? { ...c, shortComment: responseData.data.shortComment } : c)));

    //             showMessage.success("Skrócony komentarz został dodany");
    //             return true;
    //         } catch {
    //             showMessage.error("Wystąpił błąd podczas dodawania skróconego komentarza");
    //             return false;
    //         } finally {
    //             setIsSubmittingComment(false);
    //         }
    //     },
    //     [showMessage]
    // );
    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?recipeId=${recipeId}`);
            const data = await res.json();
            if (!data.ok) {
                switch (data?.error?.code) {
                    case "MISSING_RECIPE_ID":
                        showMessage.warning(data.error.message);
                        break;

                    case "FETCH_COMMENTS_FAILED":
                        showMessage.error(data.error.message);
                        break;

                    default:
                        showMessage.error("Wystąpił nieznany błąd");
                }

                setComments([]);
                return;
            }
            const safeComments: RecipeComment[] = Array.isArray(data.data.comments) ? data.data.comments.filter(Boolean) : [];

            setComments(safeComments);
        } catch (err) {
            console.error("[COMMENTS][GET]", {
                error: err,
                recipeId,
            });
            setComments([]);
            showMessage.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
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
    const safeFlatComments = useMemo(() => comments ?? [], [comments]);

    const commentTree = useMemo(() => buildCommentTree(safeFlatComments), [safeFlatComments]);
    const { visibleItems, viewMode, toggleCommentsVisibility, buttonLabel, hasAny } = useCommentsVisibility(commentTree, 3);

    return (
        <>
            <Box id="comments">
                <LoadingIndicator open={isSubmittingComment} prompt="Dodawanie komentarza w toku" />
                <Accordion expanded={accordionOpen} onChange={(_, expanded) => setAccordionOpen(expanded)} elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h5">Komentarze ({safeFlatComments.length})</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        {/* FORM */}
                        <Box ref={formRef}>
                            <Collapse in={formOpen} timeout={400} sx={collapseSx}>
                                <CommentForm
                                    submitLabel="Dodaj"
                                    // onSubmitShortComment={handleAddShortComment}
                                    onSubmitNormalComment={async data => {
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
                                        <CommentItem /*handleAddShortComment={handleAddShortComment}*/ key={comment._id} comment={comment} recipeId={recipeId} handleAddComment={handleAddComment} />
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
// todo warto rozważyć hooka do optimistic, który będzie sam zwracał callbacki do sukcesu i proażki
