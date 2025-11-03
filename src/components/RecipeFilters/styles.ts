import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";

export const containerSx: SxProps = {
    maxWidth: 400,
    width: "100%",
    position: "relative",
};

export const fieldBoxSx: SxProps = {
    mb: 2,
};

export const buttonGroupSx: SxProps = {
    display: "flex",
    gap: 1,
    justifyContent: "center",
    flexWrap: "wrap",
};

export const chipContainerSx: SxProps = {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.5,
    maxHeight: 100,
};

export const chipSx = (theme: Theme): SxProps => ({
    backgroundColor: theme.palette.primary.light,
    color: "white",
});

export const hiddenChipSx = (theme: Theme): SxProps => ({
    backgroundColor: theme.palette.primary.light,
    color: "white",
});

export const summaryTextSx = (theme: Theme): SxProps => ({
    mt: 2,
    color: theme.palette.text.primary,
});

export const labelSx = (theme: Theme): SxProps => ({
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
            boxShadow: `0 0 0 3px ${theme.palette.primary.main}30`,
        },
    },
});
export const dividerSx = { mb: 2 };