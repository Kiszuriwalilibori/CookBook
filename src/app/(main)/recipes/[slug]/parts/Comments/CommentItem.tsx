"use client";

import { useState } from "react";
import { alpha } from "@mui/material/styles";
import { Box, Typography, Button, TextField, IconButton, Tooltip } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { RecipeComment } from "@/types";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(date));
}

export default function CommentItem({ comment, recipeId, refresh, depth = 0 }: { comment: RecipeComment; recipeId: string; refresh: () => void; depth?: number }) {
    // ✅ HOOKS ZAWSZE NA GÓRZE
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState("");

    // 🧠 guard PO hookach
    if (!comment) return null;

    const isPending = comment.status === "pending";

    async function handleReply() {
        if (!replyText.trim()) return;

        await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recipeId,
                parentId: comment._id,
                content: replyText,
                author: "Anon",
                fingerprint: crypto.randomUUID(),
            }),
        });

        setReplyText("");
        setReplyOpen(false);
        refresh();
    }

    async function handleLike() {
        await fetch("/api/comments", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                commentId: comment._id,
                author: "Anon",
                fingerprint: crypto.randomUUID(),
            }),
        });

        refresh();
    }

    return (
        <Box ml={depth * 3}>
            <Box p={1}>
                <Typography variant="body2" mb={1}>
                    <strong>{comment.author}</strong> w dniu {formatDate(comment.createdAt)} napisał:
                </Typography>

                <Typography variant="body2" mb={1}>
                    {comment.content}
                </Typography>

                {isPending && (
                    <Typography variant="caption" color="warning.main">
                        Oczekuje na moderację...
                    </Typography>
                )}

                <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="Polub komentarz" arrow>
                        <IconButton
                            size="small"
                            color="primary"
                            disableRipple
                            onClick={handleLike}
                            sx={theme => ({
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.light, 0.2),
                                },
                            })}
                        >
                            <ThumbUpIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Typography variant="caption">{comment.likesCount}</Typography>

                    <Tooltip title="Odpowiedz na komentarz" arrow>
                        <IconButton
                            size="small"
                            color="primary"
                            disableRipple
                            onClick={() => setReplyOpen(!replyOpen)}
                            sx={theme => ({
                                "&:hover": {
                                    backgroundColor: alpha(theme.palette.primary.light, 0.2),
                                },
                            })}
                        >
                            <ChatBubbleOutlineIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {replyOpen && (
                    <Box mt={1} display="flex" gap={1}>
                        <TextField size="small" fullWidth placeholder="Odpowiedź..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                        <Button onClick={handleReply}>Wyślij</Button>
                    </Box>
                )}
            </Box>

            <Box mt={1} display="flex" flexDirection="column" gap={1}>
                {(comment.replies ?? []).filter(Boolean).map(reply => (
                    <CommentItem key={reply._id} comment={reply} recipeId={recipeId} refresh={refresh} depth={depth + 1} />
                ))}
            </Box>
        </Box>
    );
}
