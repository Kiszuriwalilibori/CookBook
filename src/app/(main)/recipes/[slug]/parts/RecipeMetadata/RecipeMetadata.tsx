// app/recipes/[slug]/parts/RecipeMetadata/RecipeMetadata.tsx
import { Box } from "@mui/material";

import { styles } from "../../styles";
import RecipeMetadataItem from "./RecipeMetadataItem";
import { recipeMetadataConfig } from "./RecipeMetadata.config";
import { hasValue } from "./RecipeMetadata.utils";
import { RecipeMetadataFlat } from "./RecipeMetadata.types";
import { Recipe } from "@/types";

interface RecipeMetadataProps {
    metadata: RecipeMetadataFlat;
}

export function RecipeMetadata({ metadata }: RecipeMetadataProps) {
    return (
        <Box id="RecipeMetadata" sx={styles.metadata}>
            {recipeMetadataConfig.map(({ key, icon, label, format }) => {
                if (!hasValue(metadata, key)) {
                    return null;
                }

                const rawValue = metadata[key];

                // hasValue gwarantuje, że rawValue != null
                const value = format ? format(rawValue as never, metadata as Recipe) : rawValue;

                return <RecipeMetadataItem key={key} icon={icon} label={label} value={value} />;
            })}
        </Box>
    );
}

export default RecipeMetadata;
