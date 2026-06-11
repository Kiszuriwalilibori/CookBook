import React from "react";
import { Box } from "@mui/material";
import Slider from "@/components/Slider/Slider";
import getRandomRecipes from "@/utils/getRandomRecipes";
import getLatestRecipes from "@/utils/getLatestRecipes";
import { LatestRecipesSection, TopRatedRecipesSection } from "@/components";
import getTopRatedRecipes from "@/utils/getTopRatedRecipes";
import { pageRootSx, contentWrapperSx, leftColumnSx, rightColumnSx } from "./recipes/recipes.page.styles";

// ISR: adjust revalidate to taste (seconds)
export const revalidate = 60;

export default async function Page() {
    const slides = await getRandomRecipes(5);
    const latestRecipes = await getLatestRecipes(6);
    const topRatedRecipes = await getTopRatedRecipes(6);

    return (
        <Box sx={pageRootSx}>
            {/* Pass server-fetched slides to the client Slider*/}
            <Slider initialSlides={slides} />
            {/* Sekcja Najnowsze */}
            <Box sx={contentWrapperSx}>
                <Box id="left column" sx={leftColumnSx}>
                    <LatestRecipesSection recipes={latestRecipes} />
                </Box>

                <Box id="right column" sx={rightColumnSx}>
                    <TopRatedRecipesSection recipes={topRatedRecipes} />
                </Box>
            </Box>
        </Box>
    );
}
