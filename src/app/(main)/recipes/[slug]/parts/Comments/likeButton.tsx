import { IconButton, Tooltip, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { alpha } from "@mui/material/styles";

type LikeButtonProps = {
    alreadyLiked: boolean;
    likesCount: number;
    isLiking: boolean;
    animate: boolean;
    onLike: () => void;
};

export function LikeButton({ alreadyLiked, likesCount, isLiking, animate, onLike }: LikeButtonProps) {
    return (
        <>
            <Tooltip title="Polub komentarz" arrow>
                <IconButton
                    size="small"
                    color="primary"
                    disableRipple
                    onClick={onLike}
                    disabled={isLiking}
                    sx={theme => ({
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.primary.light, 0.2),
                        },
                    })}
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

            <Typography variant="caption">{likesCount}</Typography>
        </>
    );
}
