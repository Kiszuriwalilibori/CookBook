import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

type LikeButtonProps = {
    alreadyLiked: boolean;
    likesCount: number;
    isLiking: boolean;
    animate: boolean;
    onLike: () => void;
};

export function LikeButton({ alreadyLiked, likesCount, isLiking, animate, onLike }: LikeButtonProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={alreadyLiked ? "Cofnij polubienie" : "Polub komentarz"} arrow>
                <IconButton
                    size="medium"
                    color="primary"
                    disableRipple
                    onClick={onLike}
                    disabled={isLiking}
                    sx={{
                        "&:hover": {
                            backgroundColor: "rgba(15, 20, 25, 0.08)",
                        },
                    }}
                >
                    <ThumbUpIcon
                        fontSize="small"
                        sx={{
                            color: alreadyLiked ? "success.main" : "action.active",
                            transform: animate ? "scale(1.3)" : "scale(1)",
                            transition: "transform 0.2s ease, color 0.2s ease",
                            "@keyframes pop": {
                                "0%": { transform: "scale(1)" },
                                "50%": { transform: "scale(1.4)" },
                                "100%": { transform: "scale(1)" },
                            },
                            animation: animate ? "pop 0.3s ease" : "none",
                        }}
                    />
                </IconButton>
            </Tooltip>

            <Typography
                variant="caption"
                sx={{
                    ml: 1,
                    color: "text.secondary",
                    userSelect: "none",
                    minWidth: 18,
                    textAlign: "left",
                }}
            >
                {likesCount}
            </Typography>
        </Box>
    );
}
