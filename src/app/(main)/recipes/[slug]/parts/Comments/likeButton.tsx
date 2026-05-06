// import { Box, IconButton, Tooltip, Typography } from "@mui/material";
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";

// type LikeButtonProps = {
//     alreadyLiked: boolean;
//     likesCount: number;
//     isLiking: boolean;
//     animate: boolean;
//     onLike: () => void;
// };

// export function LikeButton({ alreadyLiked, likesCount, isLiking, animate, onLike }: LikeButtonProps) {
//     return (
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//             <Tooltip title={alreadyLiked ? "Cofnij polubienie" : "Polub komentarz"} arrow>
//                 <IconButton
//                     size="medium"
//                     color="primary"
//                     disableRipple
//                     onClick={onLike}
//                     disabled={isLiking}
//                     sx={{
//                         "&:hover": {
//                             backgroundColor: "rgba(15, 20, 25, 0.08)",
//                         },
//                     }}
//                 >
//                     <ThumbUpIcon
//                         fontSize="small"
//                         sx={{
//                             color: alreadyLiked ? "success.main" : "action.active",
//                             transform: animate ? "scale(1.3)" : "scale(1)",
//                             transition: "transform 0.2s ease, color 0.2s ease",
//                             "@keyframes pop": {
//                                 "0%": { transform: "scale(1)" },
//                                 "50%": { transform: "scale(1.4)" },
//                                 "100%": { transform: "scale(1)" },
//                             },
//                             animation: animate ? "pop 0.3s ease" : "none",
//                         }}
//                     />
//                 </IconButton>
//             </Tooltip>

//             <Typography
//                 variant="caption"
//                 sx={{
//                     ml: 1,
//                     color: "text.secondary",
//                     userSelect: "none",
//                     minWidth: 18,
//                     textAlign: "left",
//                 }}
//             >
//                 {likesCount}
//             </Typography>
//         </Box>
//     );
// }

import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useEffect, useState } from "react";

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={alreadyLiked ? "Cofnij polubienie" : "Polub komentarz"} arrow>
                <IconButton
                    size="medium"
                    color="primary"
                    disableRipple
                    onClick={onLike}
                    disabled={isLiking}
                    sx={{
                        width: 40,
                        height: 40,

                        minWidth: 44,
                        minHeight: 44,

                        boxSizing: "border-box",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": {
                            backgroundColor: "rgba(15, 20, 25, 0.08)",
                        },
                    }}
                >
                    <ThumbUpIcon
                        fontSize="medium"
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
                variant="body2"
                sx={{
                    ml: 1,
                    color: "text.secondary",
                    userSelect: "none",

                    // ✅ CLS = 0 (stabilny layout)
                    minWidth: 18,
                    textAlign: "left",
                    display: "inline-block",

                    // ✅ synchronizacja animacji
                    transition: "transform 0.15s ease, opacity 0.15s ease",
                    transform: animateCounter ? "translateY(-2px) scale(1.05)" : "translateY(0)",
                    opacity: animateCounter ? 0.7 : 1,
                }}
            >
                {likesCount}
            </Typography>
        </Box>
    );
}
