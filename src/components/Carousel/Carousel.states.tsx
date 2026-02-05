"use client";

import { Box, Skeleton, Typography } from "@mui/material";
import { Section, SlideWrapper, StyledCard, AspectBox } from "./Carousel.styles";

const SKELETON_ITEMS = [0, 1, 2];

interface CarouselErrorProps {
    message: string;
}

export function CarouselSkeleton() {
    return (
        <Section>
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    overflow: "hidden",
                }}
            >
                {SKELETON_ITEMS.map(i => (
                    <SlideWrapper key={i}>
                        <StyledCard>
                            <AspectBox>
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height="100%"
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                    }}
                                />
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
