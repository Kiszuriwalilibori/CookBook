// CommentItemHeader.tsx

"use client";

import { Box, Typography, Avatar, Chip } from "@mui/material";

import { authorAvatarSx, authorChipSx, commentDateSx, commentHeaderSx } from "./commentStyles";
import { Dot } from "./Dot";

type CommentItemHeaderProps = {
    author: string;
    createdAt: string;
    isAdminComment: boolean;
    relativeTime: string;
    absoluteDate: string;
    isOwnComment: boolean;
};

export default function CommentItemHeader({ author, createdAt, isAdminComment: isAdminComment, isOwnComment, relativeTime, absoluteDate }: CommentItemHeaderProps) {
    return (
        <Box sx={commentHeaderSx}>
            {isAdminComment && <Avatar src="/images/author.jpg" alt="Piotr" sx={authorAvatarSx} />}

            {/* <Typography variant="body1">
                <strong>{author}</strong>
            </Typography> */}
            <Typography
                variant="body1"
                sx={{
                    color: isOwnComment ? "success.main" : "text.primary",
                    fontWeight: isOwnComment ? 700 : 500,
                }}
            >
                {author}
            </Typography>
            {isAdminComment && <Chip label="Autor" size="small" color="primary" sx={authorChipSx} />}

            <Typography variant="caption" sx={commentDateSx} dateTime={createdAt} component="time">
                <Dot />

                {relativeTime}
                <Dot />
                {absoluteDate}
            </Typography>
        </Box>
    );
}
