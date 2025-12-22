// footer.styles.ts
import { SxProps, Theme } from "@mui/material";

export const footerContainer: SxProps<Theme> = {
    py: 3,
    px: 2,
    mt: "auto",
    backgroundColor: theme => theme.palette.background.paper,
};

export const footerContent: SxProps<Theme> = {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "space-between",
    alignItems: "center",
};

export const linkContainer: SxProps<Theme> = {
    display: "flex",
    gap: 2,
    mt: { xs: 2, md: 0 },
};

export const linkStyle: SxProps<Theme> = {
    textDecoration: "none",
    "&:hover": {
        textDecoration: "underline",
    },
};
