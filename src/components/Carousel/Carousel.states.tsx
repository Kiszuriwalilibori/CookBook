"use client";

import { Box, Skeleton, Typography } from "@mui/material";
import { Section, SlideWrapper, StyledCard, AspectBox, skeletonContainerStyles, skeletonStyles } from "./Carousel.styles";

const SKELETON_ITEMS = [0, 1, 2];

interface CarouselErrorProps {
    message: string;
}

export function CarouselSkeleton() {
    return (
        <Section>
            <Box sx={skeletonContainerStyles}>
                {SKELETON_ITEMS.map(i => (
                    <SlideWrapper key={i}>
                        <StyledCard>
                            <AspectBox>
                                <Skeleton variant="rectangular" width="100%" height="100%" sx={skeletonStyles} />
                            </AspectBox>
                        </StyledCard>
                    </SlideWrapper>
                ))}
            </Box>
        </Section>
    );
}

export function CarouselEmpty() {
    return (
        <Section>
            <Typography align="center">No items</Typography>
        </Section>
    );
}

export function CarouselError({ message }: CarouselErrorProps) {
    return (
        <Section>
            <Typography align="center" color="error">
                {message}
            </Typography>
        </Section>
    );
}
