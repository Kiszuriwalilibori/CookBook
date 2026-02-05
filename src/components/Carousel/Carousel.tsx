"use client";

import React, { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import CarouselLib from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { CarouselSkeleton, CarouselError } from "./Carousel.states";

import { Section, SlideWrapper, StyledCard, AspectBox, SlideImage, Overlay } from "./Carousel.styles";
import Typography from "@mui/material/Typography";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useRouter } from "next/navigation";

type Slide = {
    _id: string;
    slug?: string | null;
    imageUrl?: string | null;
    title?: string | null;
};

interface CarouselProps {
    count?: number;
    intervalMs?: number;
    initialSlides?: Slide[] | null;
}

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1200 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 1200, min: 900 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 900, min: 0 },
        items: 1,
    },
};

export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
    const [items, setItems] = useState<Slide[] | null>(initialSlides);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
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

    if (items === null) {
        return <CarouselSkeleton />;
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
                            <Link
                                href={slide.slug ? `/recipes/${slide.slug}` : `/recipes/${slide._id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <AspectBox>
                                    <SlideImage src={slide.imageUrl || "/placeholder.png"} alt={slide.title ?? "Recipe"} />

                                    <Overlay>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {slide.title ?? "Untitled"}
                                        </Typography>
                                    </Overlay>
                                </AspectBox>
                            </Link>
                        </StyledCard>
                    </SlideWrapper>
                ))}
            </CarouselLib>
        </Section>
    );
}
