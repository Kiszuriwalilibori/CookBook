// components/Separator.tsx
import React from "react";
import { Box } from "@mui/material";
import { styles } from "./Separator.styles";

export const Separator: React.FC = () => {
    return (
        <Box sx={styles.separator}>
            <Box sx={styles.topLine} />
            <Box sx={styles.upperLine} />
            <Box sx={styles.lowerLine} />
        </Box>
    );
};

export default Separator;
