import { SxProps, Theme } from "@mui/material";

export const FONT_SIZE = { xs: "16px", sm: "17px", md: "18px" };

export const styles: { [key: string]: SxProps<Theme> } = {
    root: {
        maxWidth: 1024,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: 3,
        backgroundColor: "#EAF0E1",
        height: "100%",
    },
};
