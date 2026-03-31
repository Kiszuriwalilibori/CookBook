"use client";

import React from "react";
import { Box } from "@mui/material";

import Carousel from "./Carousel/Carousel";

type Slide = {
    _id: string;
    slug?: string | null;
    imageUrl?: string | null;
    title?: string | null;
};

interface SliderProps {
    initialSlides?: Slide[] | null;
}

const Slider: React.FC<SliderProps> = ({ initialSlides = null }) => {
    return (
        <Box id="HomeContent" sx={{ backgroundColor: "rgb(247, 225, 155)" }}>
            <Carousel initialSlides={initialSlides} count={5} intervalMs={5000} />
        </Box>
    );
};

export default Slider;
