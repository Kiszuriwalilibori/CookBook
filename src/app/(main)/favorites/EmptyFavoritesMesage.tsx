// components/EmptyFavoritesMessage.tsx
import { Box, Typography } from "@mui/material";
import { pageContainerStyle } from "./styles";

export function EmptyFavoritesMessage() {
    return (
        <Box sx={pageContainerStyle}>
            <Typography variant="h6" textAlign="center" mt={4}>
                Nie masz jeszcze ulubionych przepisów.
            </Typography>
        </Box>
    );
}
