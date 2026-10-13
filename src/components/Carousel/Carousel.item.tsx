"use client";

import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Slide } from "./Carousel.types";
import { SlideWrapper, StyledCard, AspectBox, SlideImage, Overlay } from "./Carousel.styles";
import SlideLink from "./SlideLink";

interface CarouselItemProps {
    slide: Slide;
    priority: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ slide, priority = false }) => {
    const [imageSrc, setImageSrc] = useState(slide.imageUrl || "/placeholder.jpg");
    return (
        <SlideWrapper key={slide._id}>
            <StyledCard>
                <SlideLink slide={slide}>
                    <AspectBox id="aspect box">
                        <SlideImage
                            loading={priority ? "eager" : "lazy"}
                            fetchPriority={priority ? "high" : "auto"}
                            quality={75}
                            src={imageSrc}
                            alt={slide.title ?? "Recipe"}
                            fill
                            sizes="(max-width: 899px) calc(100vw - 8px), (max-width: 1199px) calc(50vw - 8px), calc(33.333333vw - 8px)"
                            priority={priority}
                            onError={() => setImageSrc("/placeholder.jpg")}
                        />
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
