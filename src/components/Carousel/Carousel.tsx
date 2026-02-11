"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CarouselLib from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { EmptyState } from "@/components/EmptyState";
import { CarouselError } from "./Carousel.states";
import { Section, SlideWrapper, StyledCard, AspectBox, SlideImage, Overlay } from "./Carousel.styles";
import { Slide } from "./Carousel.types";
import SlideLink from "./SlideLink";

interface CarouselProps {
    count?: number;
    intervalMs?: number;
    initialSlides?: Slide[] | null;
}

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1200 }, items: 3 },
    tablet: { breakpoint: { max: 1200, min: 900 }, items: 2 },
    mobile: { breakpoint: { max: 900, min: 0 }, items: 1 },
};

export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
    const [items, setItems] = useState<Slide[] | null>(initialSlides);
    const [error, setError] = useState<string | null>(null);
    const [initialRenderReady, setInitialRenderReady] = useState(false);
    const router = useRouter();

    // Helper: minimalna liczba obrazków dla aktualnego ekranu
    const getVisibleCount = () => {
        if (typeof window === "undefined") return 1; // SSR fallback
        const width = window.innerWidth;
        if (width >= 1200) return 3;
        if (width >= 900) return 2;
        return 1;
    };

    // Fetch slides
    useEffect(() => {
        if (initialSlides) return;

        let mounted = true;

        async function fetchSlides() {
            try {
                const res = await fetch(`/api/recipes/random?count=${count}`, { cache: "no-store" });
                const data = await res.json();

                if (!mounted) return;

                if (Array.isArray(data)) setItems(data);
                else if (Array.isArray(data?.items)) setItems(data.items);
                else setItems([]);
            } catch (e) {
                console.error(e);
                if (mounted) {
                    setError("Failed to load carousel");
                    setItems([]);
                }
            }
        }

        fetchSlides();
        return () => {
            mounted = false;
        };
    }, [count, initialSlides]);

    // Load images i minimalna liczba do pierwszego renderu
    useEffect(() => {
        if (!items || items.length === 0) {
            setInitialRenderReady(true);
            return;
        }

        const visibleCount = getVisibleCount();
        let mounted = true;
        let loadedCount = 0;

        setInitialRenderReady(false);

        items.forEach(slide => {
            const img = new Image();
            img.src = slide.imageUrl || "/placeholder.png";
            img.onload = img.onerror = () => {
                if (!mounted) return;
                loadedCount += 1;

                // Minimalna liczba obrazków gotowa → render karuzeli
                if (loadedCount >= visibleCount) {
                    setInitialRenderReady(true);
                }
            };
        });

        return () => {
            mounted = false;
        };
    }, [items]);

    // Spinner dopóki minimalna liczba obrazków się nie załaduje
    if (!items || !initialRenderReady) {
        return (
            <Section>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 300,
                    }}
                >
                    <CircularProgress />
                </Box>
            </Section>
        );
    }

    if (error) {
        return <CarouselError message={error} />;
    }

    if (items.length === 0) {
        return <EmptyState icon={<SearchOffIcon />} title="No featured recipes" description="Check back later or explore all recipes" actionLabel="Browse recipes" onAction={() => router.push("/recipes")} />;
    }

    return (
        <Section>
            <CarouselLib responsive={responsive} infinite autoPlay autoPlaySpeed={intervalMs} arrows keyBoardControl pauseOnHover>
                {items.map(slide => (
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
                ))}
            </CarouselLib>
        </Section>
    );
}
