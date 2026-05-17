// CommentItemHeader.tsx

"use client";

import { Box, Typography, Avatar, Chip } from "@mui/material";

import { authorAvatarSx, authorChipSx, commentDateSx, commentHeaderSx } from "./commentStyles";
import { Dot } from "./utils/Dot";

type CommentItemHeaderProps = {
    author: string;
    createdAt: string;
    isAuthorComment: boolean;
    relativeTime: string;
    absoluteDate: string;
};

export default function CommentItemHeader({ author, createdAt, isAuthorComment, relativeTime, absoluteDate }: CommentItemHeaderProps) {
    return (
        <Box sx={commentHeaderSx}>
            {isAuthorComment && <Avatar src="/images/author.jpg" alt="Piotr" sx={authorAvatarSx} />}

            <Typography variant="body1">
                <strong>{author}</strong>
            </Typography>

            {isAuthorComment && <Chip label="Autor" size="small" color="primary" sx={authorChipSx} />}

            <Typography variant="caption" sx={commentDateSx} dateTime={createdAt} component="time">
                <Dot />

                {relativeTime}
                <Dot />
                {absoluteDate}
            </Typography>
        </Box>
    );
}
