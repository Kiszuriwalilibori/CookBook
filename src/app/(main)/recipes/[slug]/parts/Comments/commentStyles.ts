// commentStyles.ts
import { alpha, darken, Theme } from "@mui/material/styles";

/* -------- CommentForm -------- */

export const paperSx = (theme: Theme) => ({
    backgroundColor: theme.palette.secondary.light,
    border: `1px solid ${theme.palette.secondary.dark}`,
    borderRadius: 2,
    p: 2,
});

export const textFieldSx = (theme: Theme) => ({
    mb: 2,

    "& .MuiOutlinedInput-root": {
        position: "relative",

        "& fieldset": {
            borderColor: theme.palette.secondary.dark,
        },

        "&:hover fieldset": {
            borderColor: theme.palette.secondary.dark,
        },

        "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary.dark,
            borderWidth: 2,
        },

        "&.Mui-focused": {
            boxShadow: `0 0 0 2px ${theme.palette.secondary.light}`,
        },
        "&.Mui-focused.MuiOutlinedInput-notchedOutline": {
            borderColor: `${theme.palette.secondary.light} !important`,
        },
    },

    "& .MuiInputLabel-root": {
        color: theme.palette.secondary.dark,
    },

    "& .MuiInputLabel-root.Mui-focused": {
        color: theme.palette.secondary.dark,
    },
});

export const submitButtonSx = (theme: Theme) => ({
    backgroundColor: theme.palette.secondary.dark,
    flex: { sm: 1 },
    minWidth: { sm: 140 },
    color: "#fff",
    "&:hover": {
        backgroundColor: darken(theme.palette.secondary.dark, 0.15),
    },
});

/* -------- Comments -------- */

export const skeletonContainerSx = {
    // opcjonalne — na przyszłość
};

//CommentItem
export const commentWrapperSx = (depth: number) => ({
    position: "relative",
    display: "flex",
    ml: depth > 0 ? 2 : 0,
});

export const threadLineSx = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "2px",
    bgcolor: "divider",
    borderRadius: 1,
};

export const commentContentWrapperSx = (depth: number) => (theme: Theme) => ({
    flex: 1,
    pl: depth > 0 ? 2 : 0,
});

export const commentCardSx = (depth: number) => (theme: Theme) => ({
    p: 1.5,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: depth === 0 ? theme.palette.background.paper : theme.palette.action.hover,
    transition: "background 0.2s ease",
    position: "relative",
});

export const commentHeaderSx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
};

export const authorAvatarSx = {
    width: 28,
    height: 28,
};

export const authorChipSx = {
    height: 20,
    fontSize: 11,
};

export const commentDateSx = {
    ml: 0.5,
};

export const commentActionsSx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
};

export const repliesContainerSx = {
    mt: 1,
    display: "flex",
    flexDirection: "column",
    gap: 1,
};

// LikeButton

export const likeButtonWrapperSx = {
    display: "flex",
    alignItems: "center",
};

export const likeButtonSx = {
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
};

export const likeIconSx = (alreadyLiked: boolean, animate: boolean) => ({
    color: alreadyLiked ? "success.main" : "action.active",
    transform: animate ? "scale(1.3)" : "scale(1)",
    transition: "transform 0.2s ease, color 0.2s ease",

    "@keyframes pop": {
        "0%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.4)" },
        "100%": { transform: "scale(1)" },
    },

    animation: animate ? "pop 0.3s ease" : "none",
});

export const likesCounterSx = (animateCounter: boolean) => ({
    ml: 1,
    color: "text.secondary",
    userSelect: "none",

    minWidth: 18,
    textAlign: "left",
    display: "inline-block",

    transition: "transform 0.15s ease, opacity 0.15s ease",
    transform: animateCounter ? "translateY(-2px) scale(1.05)" : "translateY(0)",
    opacity: animateCounter ? 0.7 : 1,
});

// ReplyButton

export const replyButtonSx = (theme: Theme) => ({
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.light, 0.2),
    },
});

//Comments

export const collapseSx = {
    mt: 1,
};

export const commentsContainerSx = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
};

export const commentsListSx = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
};

export const showMoreButtonWrapperSx = {
    textAlign: "center",
};

export const mobileCommentButtonWrapperSx = {
    position: "fixed",
    bottom: 16,
    left: 0,
    right: 0,
    display: { xs: "flex", md: "none" },
    justifyContent: "center",
    zIndex: 1300,
};

export const desktopCommentButtonWrapperSx = {
    position: "fixed",
    right: 24,
    bottom: 24,
    display: { xs: "none", md: "flex" },
    zIndex: 1300,
};
