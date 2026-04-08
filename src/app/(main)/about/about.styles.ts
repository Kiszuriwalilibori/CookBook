import { SxProps, Theme } from "@mui/material";

export const FONT_SIZE = { xs: "16px", sm: "17px", md: "18px" };

export const styles: { [key: string]: SxProps<Theme> } = {
    root: {
        maxWidth: 1024,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: 3,
        backgroundColor: "secondary.light",
        height: "100%",
    },
    paragraph: {
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "clamp(15px, 1.1vw, 18px)",
        lineHeight: 1.7,
        textAlign: "justify",
        marginBottom: "1.2em",
    } as SxProps<Theme>,
};
