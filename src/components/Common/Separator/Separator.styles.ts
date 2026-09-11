// components/Separator.styles.ts
import { design } from "@/themes/design";
import { SxProps, Theme } from "@mui/material";

const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio ≈ 1.618

export const styles: { [key: string]: SxProps<Theme> } = {
    separator: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    topLine: {
        width: `${(100 / PHI / PHI).toFixed(1)}%`, // Golden ratio section of upper ≈ 38.2% of container
        height: "1px",
        backgroundColor: design.separatorColor,
        mb: 0,
    },
    upperLine: {
        width: `${(100 / PHI).toFixed(1)}%`, // Golden ratio section ≈ 61.8% of container
        height: "1px",
        backgroundColor: design.separatorColor,
        mt: "2px",
        mb: 0,
    },
    lowerLine: {
        width: `${(100 / PHI / PHI).toFixed(1)}%`, // Golden ratio section of upper ≈ 38.2% of container
        height: "1px",
        backgroundColor: design.separatorColor,
        mt: "2px",
    },
};
