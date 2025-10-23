// app/recipes/[slug]/parts/RecipePrintButton.tsx (new: simple print button)
"use client";

import { Button } from "@mui/material";
import { styles } from "../styles";

export function RecipePrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Button
            id="RecipePrintButton"
            variant="outlined"
            onClick={handlePrint}
            sx={{
                ...styles.copyButton, // Reuse base styles for consistency (responsive, WCAG, transition)
                ml: 2, // Space from copy button
                color: theme => theme.palette.surface.main,
                borderColor: theme => theme.palette.surface.main,
                "&:hover": {
                    borderColor: theme => theme.palette.surface.light,
                    color: theme => theme.palette.surface.light,
                    backgroundColor: theme => theme.palette.action.hover,
                },
            }}
        >
            Drukuj przepis
        </Button>
    );
}
