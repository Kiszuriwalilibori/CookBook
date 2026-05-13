// commentStyles.ts
import { alpha, darken, Theme } from "@mui/material/styles";

/* -------- CommentForm -------- */

export const paperSx = (theme: Theme) => ({
    backgroundColor: theme.palette.secondary.light,
    border: `1px solid ${theme.palette.secondary.dark}`,
    borderRadius: 2,
    p: 2,
});

export const formLabelSx = {
    fontWeight: 600,

    color: "text.primary",

    textAlign: {
        sm: "right",
    },

    "& .MuiFormLabel-asterisk": {
        color: "error.main",
    },
};
export const fieldRowSx = {
    display: "grid",

    gridTemplateColumns: {
        xs: "1fr",
        sm: "140px 1fr",
    },

    alignItems: {
        sm: "center",
    },

    gap: 1.5,

    mb: 2,
};

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
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
        borderWidth: 2,
        borderColor: theme.palette.secondary.main,
    },

    "& .MuiOutlinedInput-root.Mui-focused": {
        boxShadow: `0 0 0 3px ${alpha(theme.palette.secondary.main, 0.35)}`,
    },
});
export const errorBoxSx = {
    minHeight: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
};
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

export const threadLineSx = (theme: Theme) => ({
    position: "absolute",

    left: 6,
    top: 8,
    bottom: 8,

    width: "2px",

    // backgroundColor: theme.palette.divider,

    // opacity: 0.35,
    backgroundColor: theme.palette.mode === "light" ? "rgba(60, 60, 60, 0.35)" : "rgba(220, 220, 220, 0.25)",

    borderRadius: 999,
});

export const commentContentWrapperSx = (depth: number) => (theme: Theme) => ({
    flex: 1,
    pl: depth > 0 ? 2 : 0,
});

export const commentCardSx = (depth: number) => (theme: Theme) => ({
    padding: 2,

    borderRadius: depth === 0 ? 2 : 0,

    backgroundColor: depth === 0 ? theme.palette.action.hover : "transparent",

    boxShadow: depth > 0 ? (theme.palette.mode === "light" ? "0 0 0 1px rgba(0,0,0,0.04)" : "0 0 0 1px rgba(255,255,255,0.06)") : "none",

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
    marginLeft: -1.25,
};

export const likeButtonSx = {
    width: 48,
    height: 48,
    minWidth: 48,
    minHeight: 48,
    padding: 0,

    boxSizing: "border-box",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "&:hover": {
        backgroundColor: "rgba(15, 20, 25, 0.08)",
    },
};

// export const likeIconSx = (alreadyLiked: boolean, animate: boolean) => ({
//     color: alreadyLiked ? "success.main" : "action.active",
//     transform: animate ? "scale(1.3)" : "scale(1)",
//     transition: "transform 0.2s ease, color 0.2s ease",

//     "@keyframes pop": {
//         "0%": { transform: "scale(1)" },
//         "50%": { transform: "scale(1.4)" },
//         "100%": { transform: "scale(1)" },
//     },

//     animation: animate ? "pop 0.3s ease" : "none",
// });
export const likeIconSx = (alreadyLiked: boolean, animate: boolean) => ({
    color: alreadyLiked ? "success.main" : "action.active",

    transform: animate ? "scale(1.55) rotate(-8deg)" : "scale(1) rotate(0deg)",

    transition: "transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease",

    willChange: "transform",

    "@keyframes pop": {
        "0%": {
            transform: "scale(1) rotate(0deg)",
        },
        "45%": {
            transform: "scale(1.55) rotate(-8deg)",
        },
        "100%": {
            transform: "scale(1) rotate(0deg)",
        },
    },

    animation: animate ? "pop 260ms cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
});
// export const likesCounterSx = (animateCounter: boolean) => ({
//     ml: "-0.5rem",
//     color: "text.secondary",
//     userSelect: "none",

//     minWidth: 18,
//     textAlign: "left",
//     display: "inline-block",

//     transition: "transform 0.15s ease, opacity 0.15s ease",
//     transform: animateCounter ? "translateY(-2px) scale(1.05)" : "translateY(0)",
//     opacity: animateCounter ? 0.7 : 1,
// });
export const likesCounterSx = (animateCounter: boolean) => ({
    ml: "-0.5rem",

    color: "text.secondary",

    userSelect: "none",

    minWidth: 18,

    textAlign: "left",

    display: "inline-block",

    transition: "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease",

    transform: animateCounter ? "translateY(-4px) scale(1.18)" : "translateY(0) scale(1)",

    opacity: animateCounter ? 0.82 : 1,

    willChange: "transform",
});
export const replyButtonSx = (theme: Theme) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,

    padding: "4px 8px",

    borderRadius: 999,

    color: theme.palette.text.secondary,

    backgroundColor: "transparent",

    border: "none",

    textTransform: "none",

    fontWeight: 400,

    transition: "all 0.15s ease",

    "&:hover": {
        backgroundColor: alpha(theme.palette.text.primary, 0.04),
        color: theme.palette.text.primary,
    },

    "&:focus-visible": {
        outline: `2px solid ${theme.palette.text.primary}`,
        outlineOffset: 2,
    },
    "& .MuiButton-icon": {
        marginRight: 0,
        marginLeft: 0,

        position: "relative",
        top: "-1px",
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
export const mobileCommentButtonSx = {
    minHeight: 48,
    padding: "12px 16px",
    borderRadius: 24,
};

export const desktopCommentButtonWrapperSx = {
    position: "fixed",
    right: 24,
    bottom: 24,
    display: { xs: "none", md: "flex" },
    zIndex: 1300,
};
