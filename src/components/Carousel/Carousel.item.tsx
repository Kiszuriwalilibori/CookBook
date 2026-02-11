"use client";

import React from "react";
import Typography from "@mui/material/Typography";
import { Slide } from "./Carousel.types";
import { SlideWrapper, StyledCard, AspectBox, SlideImage, Overlay } from "./Carousel.styles";
import SlideLink from "./SlideLink";

interface SlideItemProps {
    slide: Slide;
}

const CarouselItem: React.FC<SlideItemProps> = ({ slide }) => {
    return (
        <SlideWrapper key={slide._id}>
            <StyledCard>
                <SlideLink slide={slide}>
                    <AspectBox>
                        <SlideImage src={slide.imageUrl || "/placeholder.png"} alt={slide.title ?? "Recipe"} />
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
