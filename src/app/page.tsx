import React from "react";
import { Box } from "@mui/material";
import Slider from "@/components/Slider";
import getRandomRecipes from "@/utils/getRandomRecipes";
import getLatestRecipes from "@/utils/getLatestRecipes";
import { LatestRecipesSection, TopRatedRecipesSection } from "@/components";
import getTopRatedRecipes from "@/utils/getTopRatedRecipes";

// ISR: adjust revalidate to taste (seconds)
export const revalidate = 60;

export default async function Page() {
    const slides = await getRandomRecipes(5);
    const latestRecipes = await getLatestRecipes(6);
    const topRatedRecipes = await getTopRatedRecipes(6);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Pass server-fetched slides to the client Slider*/}
            <Slider initialSlides={slides} />
            {/* Sekcja Najnowsze */}
            <Box
                sx={{
                    display: "flex",
                    flex: 1, // wypełnia pozostałą wysokość strony
                    flexDirection: { xs: "column", md: "row" },
                    width: "100%",
                }}
            >
                {/* LEWA: Najnowsze */}
                <Box sx={{ flex: 1, borderRight: { xs: "none", md: "1px solid #ccc" } }}>
                    <LatestRecipesSection recipes={latestRecipes} />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <TopRatedRecipesSection recipes={topRatedRecipes} />
                </Box>
            </Box>
        </Box>
    );
}
