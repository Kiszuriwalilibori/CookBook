// app/recipes/[slug]/parts/RecipeMetadata/RecipeMetadata.tsx
import { Box } from "@mui/material";
import { Recipe } from "@/types";
import { styles } from "../../styles";
import RecipeMetadataItem from "./RecipeMetadataItem";
import { recipeMetadataConfig } from "./RecipeMetadata.config";
import { hasValue } from "./RecipeMetadata.utils";

interface RecipeMetadataProps {
    recipe: Recipe;
}

export function RecipeMetadata({ recipe }: RecipeMetadataProps) {
    return (
        <Box id="RecipeMetadata" sx={styles.metadata}>
            {recipeMetadataConfig.map(({ key, icon, label, format }) => {
                if (!hasValue(recipe, key)) {
                    return null;
                }

                const rawValue = recipe[key];

                // hasValue gwarantuje, że rawValue != null
                const value = format ? format(rawValue as never, recipe) : rawValue;

                return <RecipeMetadataItem key={key} icon={icon} label={label} value={value} />;
            })}
        </Box>
    );
}

export default RecipeMetadata;
