// "use client";

// import { Box /*, Button, Container, Typography*/ } from "@mui/material";
// import { HeroCarousel } from "@/components";

// const HomeContent = () => {
//     return (
//         <Box>
//             <HeroCarousel count={5} />
//         </Box>
//     );
// };

// export default HomeContent;

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

interface HomeContentProps {
    initialSlides?: Slide[] | null;
}

const HomeContent: React.FC<HomeContentProps> = ({ initialSlides = null }) => {
    return (
        <Box>   
            <Carousel initialSlides={initialSlides} count={5} intervalMs={5000} />
        </Box>
    );
};

export default HomeContent;
