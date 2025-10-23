// app/recipes/[slug]/parts/RecipeHero.tsx
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { Recipe } from "@/lib/types";
import { styles } from "../styles";

interface RecipeHeroProps {
    recipe: Recipe;
}

export function RecipeHero({ recipe }: RecipeHeroProps) {
    return (
        <>
            {recipe.description?.image?.asset?.url && (
                <Box id="RecipeHero" sx={styles.heroImageContainer}>
                    <Image
                        src={recipe.description.image.asset.url!}
                        alt={recipe.description.image.alt || recipe.title}
                        fill
                        style={{ objectFit: "cover" }}
                        priority // Optional: Prioritize for hero image
                        sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes for optimization
                    />
                </Box>
            )}
            <Typography variant="h1" sx={styles.mainTitle}>
                {recipe.title}
            </Typography>
        </>
    );
}
