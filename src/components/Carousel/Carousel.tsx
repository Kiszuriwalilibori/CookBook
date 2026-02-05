"use client";

import React, { useEffect, useState } from "react";
import CarouselLib from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { Box, Card, CardContent, Typography } from "@mui/material";

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

// react-multi-carousel breakpoints
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

// ZŁOTA PROPORCJA
const GOLDEN_PADDING_TOP = "61.8%";

export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
    const [items, setItems] = useState<Slide[] | null>(initialSlides);
    const [error, setError] = useState<string | null>(null);

    // fallback fetch (jeśli nie dostaliśmy danych z serwera)
    useEffect(() => {
        if (initialSlides) return;

        let mounted = true;

        async function fetchSlides() {
            try {
                const res = await fetch(`/api/recipes/random?count=${count}`, { cache: "no-store" });
                const data = await res.json();
                if (!mounted) return;

                if (Array.isArray(data)) {
                    setItems(data);
                } else if (Array.isArray(data?.items)) {
                    setItems(data.items);
                } else {
                    setItems([]);
                }
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
        return (
            <Box sx={{ my: 4, textAlign: "center" }}>
                <Typography variant="h6">Loading…</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ my: 4, textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Box sx={{ my: 4, textAlign: "center" }}>
                <Typography>No items</Typography>
            </Box>
        );
    }

    return (
        <Box component="section" sx={{ my: 4 }}>
            <CarouselLib responsive={responsive} infinite autoPlay autoPlaySpeed={intervalMs} arrows keyBoardControl pauseOnHover containerClass="carousel-container" itemClass="carousel-item-padding-8px">
                {items.map(slide => (
                    <Box key={slide._id} px={0.5}>
                        <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                            <Link href={slide.slug ? `/recipes/${slide.slug}` : `/recipes/${slide._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                {/* ASPECT BOX – GOLDEN RATIO */}
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        paddingTop: GOLDEN_PADDING_TOP,
                                        backgroundColor: "#f4f4f4",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={slide.imageUrl || "/placeholder.png"}
                                        alt={slide.title ?? "Recipe"}
                                        sx={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />

                                    {/* TITLE OVERLAY */}
                                    <CardContent
                                        sx={{
                                            position: "absolute",
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            p: 1,
                                            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
                                            color: "common.white",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {slide.title ?? "Untitled"}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </Link>
                        </Card>
                    </Box>
                ))}
            </CarouselLib>
        </Box>
    );
}
