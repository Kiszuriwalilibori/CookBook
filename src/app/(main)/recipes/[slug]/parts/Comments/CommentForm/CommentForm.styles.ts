import { Theme } from "@mui/material/styles";

export const paperSx = (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
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

export const textFieldSx = (theme: Theme) => ({
    "& .MuiOutlinedInput-input::placeholder": {
        color: theme.palette.secondary.dark,
        opacity: 1,
    },
    "& .MuiOutlinedInput-root": {
        position: "relative",
        backgroundColor: theme.palette.background.default,
        "& fieldset": {
            borderColor: theme.palette.secondary.dark,
        },
        "&:hover fieldset": {
            borderColor: theme.palette.secondary.dark,
        },
    },
    "& .MuiInputLabel-root": {
        color: theme.palette.secondary.dark,
    },
});

export const characterHintSx = {
    mt: 0.5,
    fontSize: "0.75rem",
    color: "text.secondary",
};

export const submitButtonSx = (theme: Theme) => ({
    width: { xs: "100%", sm: "auto" },
    flex: { sm: 1 },
    minWidth: { sm: 140 },
});

export const actionsBoxSx = {
    display: "flex",
    flexDirection: { xs: "column-reverse", sm: "row" },
    justifyContent: { xs: "stretch", sm: "space-evenly" },
    alignItems: "center",
    gap: 1,
    mt: 1,
};

export const collapseSx = {
    mt: 1,
};
