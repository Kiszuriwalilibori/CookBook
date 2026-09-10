import type { SxProps, Theme } from "@mui/material";
import { cardTextColor } from "./styles";

export const titleStyles: SxProps<Theme> = {
    fontFamily: "Libre Baskerville, serif",
    fontWeight: "normal",
    color: cardTextColor,
    height: { xs: 50, sm: 60 },
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "uppercase",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    mb: 1,
};
