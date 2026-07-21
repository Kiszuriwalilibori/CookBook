"use client";

import React, { useEffect } from "react";
import { Box } from "@mui/material";
import useMessage from "@/hooks/useMessage";
import Carousel from "../Carousel/Carousel";
import { styles } from "./slider.styles";

type Slide = {
    _id: string;
    slug?: string | null;
    imageUrl?: string | null;
    title?: string | null;
};

interface SliderProps {
    initialSlides?: Slide[] | null;
    error?: string | null;
}

const Slider: React.FC<SliderProps> = ({ initialSlides = null, error }) => {
    const showMessage = useMessage();
    useEffect(() => {
        if (error) {
            showMessage.error(error);
        }
    }, [error]);
    return (
        <Box id="HomeContent" sx={styles.root}>
            <Carousel initialSlides={initialSlides} count={5} intervalMs={5000} />
        </Box>
    );
};

export default Slider;
