import React, { Suspense } from "react";
import { Box } from "@mui/material";
import Slider from "@/components/Slider/Slider";
import getRandomRecipes from "@/utils/getRandomRecipes";
import { LatestRecipesSection, LoadingIndicator, TopRatedRecipesSection } from "@/components";

import { pageRootSx, contentWrapperSx, leftColumnSx, rightColumnSx } from "./recipes/recipes.page.styles";
import ColumnHeader from "./recipes/pageColumnHeader";

// ISR: adjust revalidate to taste (seconds)
export const revalidate = 60;

export default async function Page() {
    const slides = await getRandomRecipes(5);

    return (
        <Box sx={pageRootSx}>
            {/* Pass server-fetched slides to the client Slider*/}
            <Slider initialSlides={slides} />

            <Box sx={contentWrapperSx}>
                <Box id="left column" sx={leftColumnSx}>
                    <ColumnHeader title={"Najnowsze"} />
                    <Suspense fallback={<LoadingIndicator centeredInParent prompt={"Trwa ładowanie najnowszych..."} />}>
                        <LatestRecipesSection />
                    </Suspense>
                </Box>

                <Box id="right column" sx={rightColumnSx}>
                    <ColumnHeader title={"Najwyżej oceniane"} />
                    <Suspense fallback={<LoadingIndicator centeredInParent prompt={"Trwa ładowanie najnowszych..."} />}>
                        <TopRatedRecipesSection />
                    </Suspense>
                </Box>
            </Box>
        </Box>
    );
}
