import React, { Suspense } from "react";
import { Box } from "@mui/material";
import Slider from "@/components/Slider/Slider";
import getRandomRecipes from "@/utils/getRandomRecipes";
import { LatestRecipesSection, LoadingIndicator, TopRatedRecipesSection } from "@/components";
import { RecipeCardSkeleton } from "@/components/RecipeCard/RecipeCard.Skeleton";
import { pageRootSx, contentWrapperSx, leftColumnSx, rightColumnSx } from "./recipes/recipes.page.styles";
import ColumnHeader from "./recipes/pageColumnHeader";
import { styles } from "@/components/LatestRecipesSection/LatestRecipeSection.styles";

// ISR: adjust revalidate to taste (seconds)
export const revalidate = 60;

export default async function Page() {
    const slidesResponse = await getRandomRecipes(5);

    return (
        <Box sx={pageRootSx}>
            {/* Pass server-fetched slides to the client Slider*/}
            <Slider initialSlides={slidesResponse.ok ? slidesResponse.data : []} error={slidesResponse.ok ? null : slidesResponse.error.message} />

            <Box sx={contentWrapperSx}>
                <Box id="left column" sx={leftColumnSx}>
                    <ColumnHeader title={"Najnowsze"} />
                    <Suspense
                        fallback={
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                }}
                            >
                                <Box sx={styles.gridContainer}>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <RecipeCardSkeleton key={index} />
                                    ))}
                                </Box>
                                <LoadingIndicator overlayInParent prompt={"Trwa ładowanie najnowszych..."} />
                            </Box>
                        }
                    >
                        <LatestRecipesSection />
                    </Suspense>
                </Box>

                <Box id="right column" sx={rightColumnSx}>
                    <ColumnHeader title={"Najwyżej oceniane"} />
                    <Suspense
                        fallback={
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                }}
                            >
                                <Box sx={styles.gridContainer}>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <RecipeCardSkeleton key={index} />
                                    ))}
                                </Box>
                                <LoadingIndicator overlayInParent prompt={"Trwa ładowanie najwyżej ocenianych..."} />
                            </Box>
                        }
                    >
                        <TopRatedRecipesSection />
                    </Suspense>
                </Box>
            </Box>
        </Box>
    );
}
