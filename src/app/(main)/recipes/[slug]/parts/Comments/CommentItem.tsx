"use client";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Avatar, Box, Button, Typography } from "@mui/material";

import { LoadingIndicator } from "@/components";
import { useFingerprint, useMessage } from "@/hooks";
import { RecipeComment } from "@/types";

import CommentForm from "./CommentForm";
import CommentItemHeader from "./CommentItemHeader";
import LikeItButton from "./LikeItButton";
import ReplyCollapse from "./ReplyCollapse";
import { ReplyButton } from "./ReplyButton";

import { authorAvatarSx, commentActionsSx, commentCardSx, commentContentSx, commentContentWrapperSx, commentWrapperSx, repliesContainerSx, shortCommentAuthorSx, shortCommentCardSx, shortCommentWrapperSx } from "./commentStyles";

import { checkIsOwnComment, getAbsoluteCommentDate, getRelativeTime, useLikeAnimation, useLikeComment, useReplyComment, useSetInitialFocusInCommentItem, useShortComment } from "./utils";

import { useRepliesVisibility } from "./utils/useRepliesVisibility";

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
    const { showReplies, visibleReplies, hiddenRepliesCount, toggleRepliesVisibility } = useRepliesVisibility(comment.replies);
    // const [showReplies, setShowReplies] = useState(false);

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
            <Box sx={commentContentWrapperSx(depth)}>
                <Box sx={commentCardSx(depth, isOwnComment)}>
                    <LoadingIndicator open={isReplySubmitting} prompt="Dodawanie odpowiedzi w toku" />

                    <LoadingIndicator open={isShortCommentSubmitting} prompt="Dodawanie krótkiego komentarza w toku" />

                    <CommentItemHeader isOwnComment={isOwnComment} author={comment.author} createdAt={comment.createdAt} isAdminComment={isAdminComment} relativeTime={getRelativeTime(comment.createdAt)} absoluteDate={getAbsoluteCommentDate(comment.createdAt)} />

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
                    {/* </Box> */}
                    {/* tu granica card */}
                    <ReplyCollapse open={formOpen} commentId={comment._id}>
                        <CommentForm textAreaRef={textAreaRef} key={formOpen ? "open" : "closed"} submitLabel="Odpowiedz" onSubmitShortComment={handleAddShortComment} onSubmitNormalComment={handleReplySubmit} onCancel={handleReplyCancel} commentId={comment._id} />
                    </ReplyCollapse>

                    <Box sx={repliesContainerSx} id={`replies-${comment._id}`}>
                        {visibleReplies.map(reply => (
                            <CommentItem key={reply._id} comment={reply} recipeId={recipeId} depth={depth + 1} handleAddComment={handleAddComment} />
                        ))}

                        {hiddenRepliesCount > 0 && (
                            <Button
                                size="small"
                                aria-expanded={showReplies}
                                aria-controls={`replies-${comment._id}`}
                                startIcon={showReplies ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                onClick={toggleRepliesVisibility}
                                sx={{
                                    minHeight: 48,
                                }}
                            >
                                {showReplies ? "Ukryj odpowiedzi" : `Pokaż jeszcze ${hiddenRepliesCount} ${hiddenRepliesCount === 1 ? "odpowiedź" : hiddenRepliesCount < 5 ? "odpowiedzi" : "odpowiedzi"}`}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
            {/* tu wywalić jednego boxa jak kombinujemy z card */}
        </Box>
    );
}
