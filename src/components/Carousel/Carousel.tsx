"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import CarouselLib from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { EmptyState } from "@/components/EmptyState";
import { Section } from "./Carousel.styles";
import { Slide } from "./Carousel.types";

import CarouselLoader from "./Carousel.loader";
import CarouselItem from "./Carousel.item";
import { ApiResponse } from "@/models/apiResponse";
import { useApiResponseErrorHandler } from "@/hooks";

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

async function parseApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
    try {
        return await res.json();
    } catch {
        throw {
            type: "PARSE_ERROR",
            message: "Invalid JSON response",
        };
    }
}

export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
    const [items, setItems] = useState<Slide[] | null>(initialSlides);

    const handleApiError = useApiResponseErrorHandler();
    // const [initialRenderReady, setInitialRenderReady] = useState(false);
    const router = useRouter();

    // Helper: minimalna liczba obrazków dla aktualnego ekranu
    // const getVisibleCount = () => {
    //     if (typeof window === "undefined") return 1; // SSR fallback
    //     const width = window.innerWidth;
    //     if (width >= 1200) return 3;
    //     if (width >= 900) return 2;
    //     return 1;
    // };

    // Fetch slides
    useEffect(() => {
        // UWAGA: cały ten kod jest 'awaryjny w tym sensie, że zasadniczo początkowe slajdy powinny przychodzić jako propsy
        if (initialSlides) return;

        let mounted = true;

        async function fetchSlides() {
            try {
                const res = await fetch(`/api/recipes/random?count=${count}`, { cache: "no-store" });

                const result = await parseApiResponse<Slide[]>(res);
                if (!mounted) return;

                if (!result.ok) {
                    throw result.error;
                }

                setItems(result.data);
            } catch (err) {
                console.log(err);
                handleApiError(err);
                if (mounted) {
                    setItems([]);
                }
            }
        }

        fetchSlides();
        return () => {
            mounted = false;
        };
    }, [count, initialSlides]);

    // // Load images i minimalna liczba do pierwszego renderu
    // useEffect(() => {
    //     if (!items || items.length === 0) {
    //         setInitialRenderReady(true);
    //         return;
    //     }

    //     const visibleCount = getVisibleCount();
    //     let mounted = true;
    //     let loadedCount = 0;

    //     setInitialRenderReady(false);

    //     items.forEach(slide => {
    //         const img = new Image();
    //         img.src = slide.imageUrl || "/placeholder.png";
    //         img.onload = img.onerror = () => {
    //             if (!mounted) return;
    //             loadedCount += 1;

    //             // Minimalna liczba obrazków gotowa → render karuzeli
    //             if (loadedCount >= visibleCount) {
    //                 setInitialRenderReady(true);
    //             }
    //         };
    //     });

    //     return () => {
    //         mounted = false;
    //     };
    // }, [items]);

    // Spinner dopóki minimalna liczba obrazków się nie załaduje
    if (!items /*|| !initialRenderReady*/) {
        return <CarouselLoader />;
    }

    if (items.length === 0) {
        return <EmptyState icon={<SearchOffIcon />} title="No featured recipes" description="Check back later or explore all recipes" actionLabel="Browse recipes" onAction={() => router.push("/recipes")} />;
    }

    return (
        <Section>
            <CarouselLib responsive={responsive} infinite autoPlay autoPlaySpeed={intervalMs} arrows keyBoardControl pauseOnHover>
                {items.map(slide => (
                    <CarouselItem key={slide._id} slide={slide} />
                ))}
            </CarouselLib>
        </Section>
    );
}

// todo parseApiResponse są zbliżone funkcje tu i tam parseBody ujednolicić
