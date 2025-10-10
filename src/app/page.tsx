import { Box, Container } from "@mui/material";
import Header from "@/components/layout/Header";
import TestRecipe from "@/components/TestRecipe";
import HomeContent from "../components/HomeContent";

type Recipe = {
    // Add properties of the Recipe type here
};

export default function Home() {
    return (
        <Box>
            {/* <Header /> */}
            {/* <TestRecipe /> */}
            <HomeContent />
        </Box>
    );
}
