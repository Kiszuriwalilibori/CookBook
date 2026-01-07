import { Typography } from "@mui/material";
// --- MetadataItem component ---
interface RecipeMetadataItemProps {
    icon?: React.ReactNode;
    label?: string;
    value: string | number | React.ReactNode;
    sx?: object;
}
export function RecipeMetadataItem({ icon, label, value, sx }: RecipeMetadataItemProps) {
    return (
        <Typography component="div" sx={sx}>
            {icon} {label ? `${label}: ` : ""}
            {value}
        </Typography>
    );
}
export default RecipeMetadataItem;