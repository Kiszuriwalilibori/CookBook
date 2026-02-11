"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { Section } from "./Carousel.styles";

interface CarouselLoaderProps {
    height?: number | string; // wysokość loadera, domyślnie 300
}

const CarouselLoader: React.FC<CarouselLoaderProps> = ({ height = 300 }) => {
    return (
        <Section>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height,
                }}
            >
                <CircularProgress />
            </Box>
        </Section>
    );
};

export default CarouselLoader;
