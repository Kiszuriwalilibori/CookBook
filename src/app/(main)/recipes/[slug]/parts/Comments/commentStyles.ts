// commentStyles.ts
import { darken, Theme } from "@mui/material/styles";
import { CSSProperties } from "react";

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
    color: "#fff",
    "&:hover": {
        backgroundColor: darken(theme.palette.secondary.dark, 0.15),
    },
});

/* -------- Comments -------- */

export const collapseSx = {
    mt: 1,
};

export const skeletonContainerSx = {
    // opcjonalne — na przyszłość
};

export const honeypotSx: CSSProperties = {
    position: "absolute",
    left: "-9999px",
    height: 0,
    opacity: 0,
};
