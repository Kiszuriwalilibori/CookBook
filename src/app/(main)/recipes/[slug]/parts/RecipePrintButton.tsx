"use client";

import { IconButton, Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { styles } from "../styles";

export function RecipePrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Tooltip title="Drukuj przepis" placement="top">
            <IconButton
                id="RecipePrintButton"
                onClick={handlePrint}
                sx={{
                    color: theme => theme.palette.surface.main, // Basic color matching current buttons
                    "&:hover": {
                        color: theme => theme.palette.surface.light, // Hover color matching current
                        backgroundColor: theme => theme.palette.action.hover,
                        borderRadius: "50%", // Round hover background
                    },
                    ...styles.copyButton, // Reuse responsive/WCAG (fontSize, padding, minHeight, focus-visible)
                }}
            >
                <PrintIcon sx={{ fontSize: "48px" }} /> {/* Twice bigger icon (default 24px → 48px) */}
            </IconButton>
        </Tooltip>
    );
}
