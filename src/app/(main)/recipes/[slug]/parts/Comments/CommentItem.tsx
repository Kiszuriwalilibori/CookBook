// "use client";
// import { useCallback, useState } from "react";

// import { Avatar, Box, Typography } from "@mui/material";
// import { RecipeComment } from "@/types";
// import { useFingerprint, useMessage } from "@/hooks";
// import CommentForm from "./CommentForm";

// import { ReplyButton } from "./ReplButton";
// import ReplyCollapse from "./ReplyCollapse";

// import { authorAvatarSx, commentActionsSx, commentCardSx, commentContentWrapperSx, commentWrapperSx, repliesContainerSx, threadLineSx } from "./commentStyles";
// import { handleApiError } from "./utils/handleError";
// import LikeItButton from "./LikeItButton";
// import { LoadingIndicator } from "@/components";
// import { checkIsOwnComment, useLikeAnimation, getRelativeTime, useSetInitialFocusInCommentItem, getAbsoluteCommentDate } from "./utils";
// import CommentItemHeader from "./CommentItemHeader";
// // import ShortCommentItem from "./ShortCommentItem";

// type AddCommentPayload = {
//     author: string;
//     content: string;
//     parentId?: string | null;
// };

// type AddCommentOptions = {
//     onSuccess?: () => void;
//     onError?: () => void;
// };

// type HandleAddComment = (payload: AddCommentPayload, options?: AddCommentOptions) => Promise<void>;

// interface CommentItemProps {
//     comment: RecipeComment;
//     recipeId: string;

//     depth?: number;
//     handleAddComment: HandleAddComment;
//     //     handleAddShortComment: (data: { commentId: string; shortContent: string }) => Promise<boolean>;
// }

// export default function CommentItem({ comment, recipeId, depth = 0, handleAddComment /*, handleAddShortComment*/ }: CommentItemProps) {
//     const [formOpen, setFormOpen] = useState(false);
//     const [likes, setLikes] = useState<string[]>(comment.likes);
//     const [isLiking, setIsLiking] = useState(false);
//     const [isReplySubmitting, setIsReplySubmitting] = useState(false);
//     const [shortComment, setShortComment] = useState<string>(comment.shortComment ? comment.shortComment.content : "");
//     const [isShortCommentSubmitting, setIsShortCommentSubmitting] = useState(false);
//     const { animateLike, triggerLikeAnimation } = useLikeAnimation(300);
//     const fingerprint = useFingerprint();
//     const showMessage = useMessage();
//     const isAuthorComment = comment.isAuthor === true;
//     const isOwnComment = checkIsOwnComment(fingerprint, comment.fingerprint);
//     const textAreaRef = useSetInitialFocusInCommentItem(formOpen);

//     const handleAddShortComment = useCallback(
//         async (data: { commentId: string; shortContent: string }) => {
//             const prevShortComment = shortComment;
//             const { commentId, shortContent } = data;

//             if (!commentId || !shortContent?.trim()) {
//                 showMessage.warning("Brak treści skróconego komentarza");
//                 return false;
//             }
//             setShortComment(shortContent.trim());
//             setIsShortCommentSubmitting(true);

//             try {
//                 const res = await fetch("/api/comments", {
//                     method: "PATCH",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         commentId,
//                         shortContent: shortContent.trim(),
//                         option: "HANDLE_SHORT_COMMENT",
//                     }),
//                 });

//                 const responseData = await res.json();

//                 if (!responseData.ok) {
//                     setShortComment(prevShortComment);
//                     handleApiError(
//                         responseData.error,
//                         {
//                             FORBIDDEN: () => showMessage.error("Brak uprawnień administratora"),
//                             INVALID_INPUT: () => showMessage.warning("Nieprawidłowe dane"),
//                             EMPTY_SHORT_COMMENT: () => showMessage.warning("Skrócony komentarz nie może być pusty"),
//                             SHORT_COMMENT_TOO_LONG: () => showMessage.warning("Skrócony komentarz jest za długi"),
//                             COMMENT_NOT_FOUND: () => showMessage.warning("Komentarz nie został znaleziony"),
//                         },
//                         msg => showMessage.error(msg || "Nie udało się dodać skróconego komentarza")
//                     );
//                     return false;
//                 }

//                 // Aktualizacja lokalnego stanu
//                 // sync z backendem
//                 setShortComment(responseData.data.shortComment.content);

//                 showMessage.success("Skrócony komentarz został dodany");
//                 return true;
//             } catch (err) {
//                 setShortComment(prevShortComment);
//                 handleApiError(err, {}, msg => showMessage.error(msg));
//                 return false;
//             } finally {
//                 setIsShortCommentSubmitting(false);
//             }
//         },
//         [showMessage]
//     );

//     const handleReplySubmit = useCallback(
//         async (data: Omit<AddCommentPayload, "parentId">) => {
//             setFormOpen(false);
//             setIsReplySubmitting(true);

//             try {
//                 await handleAddComment({
//                     ...data,
//                     parentId: comment._id,
//                 });
//             } finally {
//                 setIsReplySubmitting(false);
//             }
//         },
//         [handleAddComment, comment._id]
//     );
//     const handleReplyCancel = useCallback(() => {
//         setFormOpen(false);
//     }, []);

//     if (!comment) return null;

//     const alreadyLiked = likes.includes(fingerprint);

//     async function handleLike() {
//         if (isLiking || !fingerprint) return;

//         setIsLiking(true);
//         const prevLikes = likes;
//         const wasLiked = alreadyLiked;

//         if (!wasLiked) {
//             navigator.vibrate?.(10);
//             triggerLikeAnimation();
//         }
//         // optimistic update
//         setLikes(prev => (wasLiked ? prev.filter(id => id !== fingerprint) : [...prev, fingerprint]));

//         try {
//             const res = await fetch("/api/comments", {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     commentId: comment._id,
//                     fingerprint,
//                     option: "HANDLE_LIKE",
//                 }),
//             });
//             const data = await res.json();
//             if (!data.ok) {
//                 setLikes(prevLikes);

//                 handleApiError(
//                     data.error,
//                     {
//                         COMMENT_NOT_FOUND: msg => showMessage.error(msg),
//                         INVALID_INPUT: msg => showMessage.warning(msg),
//                         INTERNAL_ERROR: msg => showMessage.error(msg),
//                     },
//                     msg => showMessage.error(msg)
//                 );

//                 return;
//             } else {
//                 setLikes(data.data.likes);
//             }
//         } catch (err: unknown) {
//             // console.error("[COMMENTS][PATCH]", err);
//             setLikes(prevLikes);
//             showMessage.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
//         } finally {
//             setIsLiking(false);
//         }
//     }
//     return (
//         <Box sx={commentWrapperSx(depth)} id={`comment-${comment._id}`}>
//             {/* 🌲 vertical thread line */}
//             {depth > 0 && <Box sx={threadLineSx} />}

//             {/* 📦 content wrapper */}
//             <Box sx={commentContentWrapperSx(depth)}>
//                 {/* 🧱 card */}
//                 <Box sx={commentCardSx(depth, isOwnComment)}>
//                     <LoadingIndicator open={isReplySubmitting} prompt="Dodawanie odpowiedzi w toku" />
//                     <LoadingIndicator open={isShortCommentSubmitting} prompt="Dodawanie krótkiego komentarza w toku" />
//                     <CommentItemHeader author={comment.author} createdAt={comment.createdAt} isAuthorComment={isAuthorComment} relativeTime={getRelativeTime(comment.createdAt)} absoluteDate={getAbsoluteCommentDate(comment.createdAt)} />

//                     <Typography variant="body1" sx={{ mb: 0.5 }}>
//                         {comment.content}
//                     </Typography>
//                     {shortComment && (
//                         <Box id="Short_Comment" sx={{ display: "flex", justifyContent: "end" }}>
//                             <Box sx={{ ...commentCardSx(0, false), display: "flex", gap: 1 }}>
//                                 <Avatar src="/images/author.jpg" alt="Piotr" sx={authorAvatarSx} />

//                                 <Typography variant="body1">
//                                     <strong>Piotr</strong>
//                                 </Typography>

//                                 <Typography variant="body1">{typeof shortComment === "string" ? shortComment : ""}</Typography>
//                             </Box>
//                         </Box>
//                     )}

//                     <Box sx={commentActionsSx}>
//                         <LikeItButton alreadyLiked={alreadyLiked} likesCount={likes.length} isLiking={isLiking} animate={animateLike} onLike={handleLike} />

//                         <ReplyButton onToggle={() => setFormOpen(v => !v)} commentId={comment._id} author={comment.author} />
//                     </Box>

//                     <ReplyCollapse open={formOpen} commentId={comment._id}>
//                         <Box>
//                             <CommentForm textAreaRef={textAreaRef} key={formOpen ? "open" : "closed"} submitLabel="Odpowiedz" onSubmitShortComment={handleAddShortComment} onSubmitNormalComment={handleReplySubmit} onCancel={handleReplyCancel} commentId={comment._id} />
//                         </Box>
//                     </ReplyCollapse>

//                     {/* 👇 REPLIES */}
//                     <Box sx={repliesContainerSx}>
//                         {(comment.replies ?? []).filter(Boolean).map(reply => (
//                             <CommentItem key={reply._id} comment={reply} recipeId={recipeId} depth={depth + 1} handleAddComment={handleAddComment} />
//                         ))}
//                     </Box>
//                 </Box>
//             </Box>
//         </Box>
//     );
// }
"use client";

import { Box, Typography, Avatar } from "@mui/material";

import { RecipeComment } from "@/types";
import { useFingerprint, useMessage } from "@/hooks";

import { authorAvatarSx, commentActionsSx, commentCardSx, commentContentWrapperSx, commentWrapperSx, repliesContainerSx, threadLineSx } from "./commentStyles";

import { checkIsOwnComment, useLikeAnimation, getRelativeTime, useSetInitialFocusInCommentItem, getAbsoluteCommentDate } from "./utils";

import CommentForm from "./CommentForm";
import CommentItemHeader from "./CommentItemHeader";
import LikeItButton from "./LikeItButton";
import ReplyCollapse from "./ReplyCollapse";
import { ReplyButton } from "./ReplButton";

import { LoadingIndicator } from "@/components";

import { useLikeComment } from "./utils/useLikeComment";
import { useReplyComment } from "./utils/useReplyComment";
import { useShortComment } from "./utils/useShortComment";

type AddCommentPayload = {
    author: string;
    content: string;
    parentId?: string | null;
};

type HandleAddComment = (payload: AddCommentPayload) => Promise<void>;

interface CommentItemProps {
    comment: RecipeComment;
    recipeId: string;
    depth?: number;
    handleAddComment: HandleAddComment;
}

export default function CommentItem({ comment, recipeId, depth = 0, handleAddComment }: CommentItemProps) {
    const fingerprint = useFingerprint();
    const showMessage = useMessage();

    const isAuthorComment = comment.isAuthor === true;

    const isOwnComment = checkIsOwnComment(fingerprint, comment.fingerprint);

    const textAreaRef = useSetInitialFocusInCommentItem(false);

    const { animateLike, triggerLikeAnimation } = useLikeAnimation(300);

    // =========================
    // LIKE HOOK
    // =========================

    const { likes, alreadyLiked, isLiking, handleLike } = useLikeComment({
        commentId: comment._id,
        fingerprint,
        initialLikes: comment.likes,
        showMessage,
        onLikeAnimation: triggerLikeAnimation,
    });

    // =========================
    // REPLY HOOK
    // =========================

    const { formOpen, isReplySubmitting, handleReplySubmit, handleReplyCancel, toggleReplyForm } = useReplyComment({
        commentId: comment._id,
        handleAddComment,
    });

    // =========================
    // SHORT COMMENT HOOK
    // =========================

    const { shortComment, isShortCommentSubmitting, handleAddShortComment } = useShortComment({
        initialShortComment: comment.shortComment?.content ?? "",
        showMessage,
    });

    if (!comment) return null;

    return (
        <Box sx={commentWrapperSx(depth)} id={`comment-${comment._id}`}>
            {depth > 0 && <Box sx={threadLineSx} />}

            <Box sx={commentContentWrapperSx(depth)}>
                <Box sx={commentCardSx(depth, isOwnComment)}>
                    <LoadingIndicator open={isReplySubmitting} prompt="Dodawanie odpowiedzi w toku" />

                    <LoadingIndicator open={isShortCommentSubmitting} prompt="Dodawanie krótkiego komentarza w toku" />

                    <CommentItemHeader author={comment.author} createdAt={comment.createdAt} isAuthorComment={isAuthorComment} relativeTime={getRelativeTime(comment.createdAt)} absoluteDate={getAbsoluteCommentDate(comment.createdAt)} />

                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                        {comment.content}
                    </Typography>

                    {shortComment && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "end",
                            }}
                        >
                            <Box
                                sx={{
                                    ...commentCardSx(0, false),
                                    display: "flex",
                                    gap: 1,
                                }}
                            >
                                <Avatar src="/images/author.jpg" alt="Piotr" sx={authorAvatarSx} />

                                <Typography variant="body1">
                                    <strong>Piotr</strong>
                                </Typography>

                                <Typography variant="body1">{shortComment}</Typography>
                            </Box>
                        </Box>
                    )}

                    <Box sx={commentActionsSx}>
                        <LikeItButton alreadyLiked={alreadyLiked} likesCount={likes.length} isLiking={isLiking} animate={animateLike} onLike={handleLike} />

                        <ReplyButton onToggle={toggleReplyForm} commentId={comment._id} author={comment.author} />
                    </Box>

                    <ReplyCollapse open={formOpen} commentId={comment._id}>
                        <CommentForm textAreaRef={textAreaRef} key={formOpen ? "open" : "closed"} submitLabel="Odpowiedz" onSubmitShortComment={handleAddShortComment} onSubmitNormalComment={handleReplySubmit} onCancel={handleReplyCancel} commentId={comment._id} />
                    </ReplyCollapse>

                    <Box sx={repliesContainerSx}>
                        {(comment.replies ?? []).filter(Boolean).map(reply => (
                            <CommentItem key={reply._id} comment={reply} recipeId={recipeId} depth={depth + 1} handleAddComment={handleAddComment} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
