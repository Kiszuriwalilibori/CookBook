"use client";

import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Slide } from "./Carousel.types";
import { SlideWrapper, StyledCard, AspectBox, SlideImage, Overlay, focusCardStyles } from "./Carousel.styles";
import SlideLink from "./SlideLink";

interface CarouselItemProps {
    slide: Slide;
    priority: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ slide, priority = false }) => {
    const [imageSrc, setImageSrc] = useState(slide.imageUrl || "/placeholder.png");
    return (
        <SlideWrapper key={slide._id}>
            <StyledCard sx={focusCardStyles}>
                <SlideLink slide={slide}>
                    <AspectBox>
                        <SlideImage /*src={slide.imageUrl || "/placeholder.png"}*/ src={imageSrc} alt={slide.title ?? "Recipe"} fill sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={priority} onError={() => setImageSrc("/placeholder.png")} />
                        <Overlay>
                            <Typography variant="subtitle1" fontWeight={700}>
                                {slide.title ?? "Untitled"}
                            </Typography>
                        </Overlay>
                    </AspectBox>
                </SlideLink>
            </StyledCard>
        </SlideWrapper>
    );
};

export default CarouselItem;

// todo powinna być obsługa błędu odczytania obrazka
