"use client";

import { Avatar, Box, Typography } from "@mui/material";
import { RecipeComment } from "@/types";
import { authorAvatarSx, commentCardSx } from "./commentStyles";

interface Props {
    comment: RecipeComment;
}

export default function ShortCommentItem({ comment }: Props) {
    if (!comment.shortComment) return null;
    return (
        <Box
            id="Short_Comment"
            sx={{
                display: "flex",
                justifyContent: "end",
            }}
        >
            <Box
                sx={{
                    ...commentCardSx(0, false),
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "normal",
                    gap: 1,
                }}
            >
                <Avatar src="/images/author.jpg" alt="Piotr" sx={authorAvatarSx} />

                <Typography variant="body1">
                    <strong>Piotr</strong>
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        // 🔥 ważne: NIE inline (flex już to ogarnia)
                        m: 0,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                    }}
                >
                    {comment.shortComment.content}
                </Typography>
            </Box>
        </Box>
    );
}
