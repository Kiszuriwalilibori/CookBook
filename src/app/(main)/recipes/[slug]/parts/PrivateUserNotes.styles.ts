import { SxProps, Theme } from "@mui/material";
import { design } from "@/themes/design";

export const containerStyles: SxProps<Theme> = {
    mt: 4,
};

export const textStyles: SxProps<Theme> = {
    mt: 1,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    backgroundColor: theme => theme.palette.background.paper,
    borderRadius: design.radius.md,
    padding: 2,
};
