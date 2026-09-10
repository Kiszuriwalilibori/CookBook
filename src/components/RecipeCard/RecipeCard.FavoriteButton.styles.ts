import theme from "@/themes/theme";
import { red } from "@mui/material/colors";
import { SxProps } from "@mui/material";

export const favoriteButtonSx = (isFavorite: boolean): SxProps => ({
    position: "absolute",
    top: 8,
    right: 8,
    color: isFavorite ? red[500] : theme.palette.grey[600],
});
