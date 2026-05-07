import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useEffect, useState } from "react";
import { likeButtonSx, likeButtonWrapperSx, likeIconSx, likesCounterSx } from "./commentStyles";

type LikeButtonProps = {
    alreadyLiked: boolean;
    likesCount: number;
    isLiking: boolean;
    animate: boolean;
    onLike: () => void;
};

export function LikeButton({ alreadyLiked, likesCount, isLiking, animate, onLike }: LikeButtonProps) {
    const [animateCounter, setAnimateCounter] = useState(false);

    useEffect(() => {
        if (animate) {
            setAnimateCounter(true);
            const t = setTimeout(() => setAnimateCounter(false), 200);
            return () => clearTimeout(t);
        }
    }, [animate]);

    return (
        <Box sx={likeButtonWrapperSx}>
            <Tooltip title={alreadyLiked ? "Cofnij polubienie" : "Polub komentarz"} arrow>
                <IconButton aria-label={alreadyLiked ? "Cofnij polubienie komentarza" : "Polub komentarz"} size="medium" color="primary" disableRipple onClick={onLike} disabled={isLiking} sx={likeButtonSx}>
                    <ThumbUpIcon fontSize="medium" sx={likeIconSx(alreadyLiked, animate)} />
                </IconButton>
            </Tooltip>

            <Typography variant="body2" sx={likesCounterSx(animateCounter)}>
                {likesCount}
            </Typography>
        </Box>
    );
}
