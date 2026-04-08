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
            <IconButton id="RecipePrintButton" onClick={handlePrint} sx={styles.recipeButton}>
                <PrintIcon sx={styles.recipeButtonIcon} /> {/* Twice bigger icon (default 24px → 48px) */}
            </IconButton>
        </Tooltip>
    );
}
