// // app/recipes/[slug]/parts/RecipePrintButton.tsx (new: simple print button)
// "use client";

// import { Button } from "@mui/material";
// import { styles } from "../styles";

// export function RecipePrintButton() {
//     const handlePrint = () => {
//         window.print();
//     };

//     return (
//         <Button
//             id="RecipePrintButton"
//             variant="outlined"
//             onClick={handlePrint}
//             sx={{
//                 ...styles.copyButton, // Reuse base styles for consistency (responsive, WCAG, transition)
//                 ml: 2, // Space from copy button
//                 color: theme => theme.palette.surface.main,
//                 borderColor: theme => theme.palette.surface.main,
//                 "&:hover": {
//                     borderColor: theme => theme.palette.surface.light,
//                     color: theme => theme.palette.surface.light,
//                     backgroundColor: theme => theme.palette.action.hover,
//                 },
//             }}
//         >
//             Drukuj przepis
//         </Button>
//     );
// }

// app/recipes/[slug]/parts/RecipePrintButton.tsx (updated: larger icon, round hover bg)
'use client';

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
                    color: (theme) => theme.palette.surface.main, // Basic color matching current buttons
                    "&:hover": {
                        color: (theme) => theme.palette.surface.light, // Hover color matching current
                        backgroundColor: (theme) => theme.palette.action.hover,
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