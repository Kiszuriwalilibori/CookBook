import React from "react";
import { Box } from "@mui/material";
import HomeContent from "@/components/HomeContent";
import getRandomRecipes from "@/utils/getRandomRecipes";
import getLatestRecipes from "@/utils/getLatestRecipes";
import { LatestRecipesSection } from "@/components";

// ISR: adjust revalidate to taste (seconds)
export const revalidate = 60;

export default async function Page() {
    const slides = await getRandomRecipes(5);
    const latestRecipes = await getLatestRecipes(6);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Pass server-fetched slides to the client HomeContent */}
            <HomeContent initialSlides={slides} />
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

                {/* PRAWA: pusta na razie */}
                <Box sx={{ flex: 1, backgroundColor: "#f0f0f0" }}>{/* Tutaj można dodać zawartość prawej części */}</Box>
            </Box>
        </Box>
    );
}
