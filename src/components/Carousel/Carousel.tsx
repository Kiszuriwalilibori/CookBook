"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import CarouselLib from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { EmptyState } from "@/components/EmptyState";
import { Section } from "./Carousel.styles";
import { Slide } from "./Carousel.types";

import CarouselItem from "./Carousel.item";
import { ApiResponse } from "@/models/apiResponse";
import { useApiResponseErrorHandler } from "@/hooks";
import useDelayedCondition from "@/hooks/useDelayedCondition";
import { LoadingIndicator } from "@/components";
import { useCarouselStatus } from "./useCarouselStatus";

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

export const DELAY = 500;
export const DURATION = 1000;

export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
    const [items, setItems] = useState<Slide[] | null>(initialSlides);

    const { status, setCarouselStatusSuccess, setCarouselStatusEmpty, setCarouselStatusError } = useCarouselStatus(initialSlides === null ? "loading" : initialSlides.length === 0 ? "empty" : "success");
    const showLoading = useDelayedCondition(status === "loading", DELAY, DURATION);

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

                if (result.data.length === 0) {
                    setCarouselStatusEmpty();
                } else {
                    setCarouselStatusSuccess();
                }
            } catch (err) {
                console.log(err);
                handleApiError(err);
                if (mounted) {
                    setItems([]);
                    setCarouselStatusError();
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
    // if (!items /*|| !initialRenderReady*/) {
    //     return <CarouselLoader />;
    // }

    return (
        <Section>
            {showLoading && <LoadingIndicator prompt="Ładowanie przepisów..." centeredInParent={true} />}
            {status === "empty" && <EmptyState icon={<SearchOffIcon />} title="Nie ma polecanych przepisów" description="Sprawdź później albo pobierz wszystkie" actionLabel="Browse recipes" onAction={() => router.push("/recipes")} />}
            {status === "error" && <EmptyState icon={<SearchOffIcon />} title="Nie udało się załadować przepisów" description="Spróbuj ponownie później" />}
            {status === "success" && items && (
                <CarouselLib responsive={responsive} infinite autoPlay autoPlaySpeed={intervalMs} arrows keyBoardControl pauseOnHover>
                    {items.map(slide => (
                        <CarouselItem key={slide._id} slide={slide} />
                    ))}
                </CarouselLib>
            )}
        </Section>
    );
}

// todo parseApiResponse są zbliżone funkcje tu i tam parseBody ujednolicić
// todo pamiętać o renderConditionallyDelayed czy podobnym zabezpieczającym przed miganiem
