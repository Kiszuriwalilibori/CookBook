"use client";

import { Box, Typography, Avatar } from "@mui/material";

import { RecipeComment } from "@/types";
import { useFingerprint, useMessage } from "@/hooks";

import { authorAvatarSx, shortCommentWrapperSx, shortCommentCardSx, commentActionsSx, commentCardSx, commentContentWrapperSx, commentWrapperSx, repliesContainerSx, commentContentSx, shortCommentAuthorSx } from "./commentStyles";

import { useLikeComment, useReplyComment, useShortComment, checkIsOwnComment, useLikeAnimation, getRelativeTime, useSetInitialFocusInCommentItem, getAbsoluteCommentDate } from "./utils";

import CommentForm from "./CommentForm";
import CommentItemHeader from "./CommentItemHeader";
import LikeItButton from "./LikeItButton";
import ReplyCollapse from "./ReplyCollapse";
import { ReplyButton } from "./ReplyButton";

import { LoadingIndicator } from "@/components";

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

    const isAdminComment = comment.isAdmin === true;

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
            {/* {depth > 0 && <Box sx={threadLineSx} />} */}

            <Box sx={commentContentWrapperSx(depth)}>
                <Box sx={commentCardSx(depth, isOwnComment)}>
                    <LoadingIndicator open={isReplySubmitting} prompt="Dodawanie odpowiedzi w toku" />

                    <LoadingIndicator open={isShortCommentSubmitting} prompt="Dodawanie krótkiego komentarza w toku" />

                    <CommentItemHeader author={comment.author} createdAt={comment.createdAt} isAdminComment={isAdminComment} relativeTime={getRelativeTime(comment.createdAt)} absoluteDate={getAbsoluteCommentDate(comment.createdAt)} />

                    <Typography variant="body1" sx={commentContentSx}>
                        {comment.content}
                    </Typography>

                    {shortComment && (
                        <Box sx={shortCommentWrapperSx}>
                            <Box sx={shortCommentCardSx}>
                                <Avatar src="/images/author.jpg" alt="Piotr" sx={authorAvatarSx} />

                                <Typography variant="body1" sx={shortCommentAuthorSx}>
                                    Piotr
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
