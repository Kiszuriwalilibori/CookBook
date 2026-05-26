import Box from "@mui/material/Box";
import { dotSx } from "../commentStyles";

export const Dot = () => {
    return (
        <Box component="span" sx={dotSx}>
            •
        </Box>
    );
};
