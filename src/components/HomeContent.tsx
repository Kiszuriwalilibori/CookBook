"use client";

import { Box /*, Button, Container, Typography*/ } from "@mui/material";
import { HeroCarousel } from "@/components";

const HomeContent = () => {
    return (
        <Box>
            <HeroCarousel count={5} />
        </Box>
    );
};

export default HomeContent;
