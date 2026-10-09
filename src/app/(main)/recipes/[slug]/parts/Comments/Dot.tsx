import Box from "@mui/material/Box";
import { dotSx } from "./Comment.styles";

export const Dot = () => {
    return (
        <Box component="span" sx={dotSx}>
            •
        </Box>
    );
};
