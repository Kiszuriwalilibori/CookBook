import React from "react";
import { Box, Typography } from "@mui/material";
import { columnHeaderSx } from "./recipes.page.styles";

type ColumnHeaderProps = {
    title: string;
};

export default function ColumnHeader({ title }: ColumnHeaderProps) {
    return (
        <Box sx={columnHeaderSx}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
        </Box>
    );
}
