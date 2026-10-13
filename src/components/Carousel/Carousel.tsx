"use client";

import React, { useId, useMemo } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import { EmptyState } from "@/components/EmptyState";
import { LoadingIndicator } from "@/components";
import useDelayedCondition from "@/hooks/useDelayedCondition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import { CarouselArrow, CarouselContainer, EmblaContainer, EmblaSlide, EmblaViewport, Section } from "./Carousel.styles";
import CarouselItem from "./Carousel.item";
import { Slide } from "./Carousel.types";
import { useCarouselSlides } from "./useCarouselSlides";

interface CarouselProps {
    count?: number;
    intervalMs?: number;
    initialSlides?: Slide[] | null;
}

export const DELAY = 500;
export const DURATION = 1000;

export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
    const { items, status } = useCarouselSlides({
        count,
        initialSlides,
    });

    const prefersReducedMotion = useReducedMotion();
    const showLoading = useDelayedCondition(status === "loading", DELAY, DURATION);

    const router = useRouter();
    const viewportId = useId();

    const options = useMemo(
        () => ({
            align: "start" as const,
            loop: true,
        }),
        []
    );

    const plugins = useMemo(
        () =>
            prefersReducedMotion
                ? []
                : [
                      Autoplay({
                          delay: intervalMs,
                          stopOnInteraction: false,
                          stopOnMouseEnter: true,
                      }),
                  ],
        [intervalMs, prefersReducedMotion]
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const target = event.target;

        if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) {
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            emblaApi?.scrollPrev();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            emblaApi?.scrollNext();
        }
    };

    return (
        <Section id="Carousel.Section">
            <CarouselContainer>
                {showLoading && <LoadingIndicator prompt="Ładowanie przepisów..." centeredInParent={true} />}

                {status === "empty" && <EmptyState icon={<SearchOffIcon />} title="Nie ma polecanych przepisów" description="Sprawdź później albo pobierz wszystkie" actionLabel="Browse recipes" onAction={() => router.push("/recipes")} />}

                {status === "error" && <EmptyState icon={<SearchOffIcon />} title="Nie udało się załadować przepisów" description="Spróbuj ponownie później" />}

                {status === "success" && items && (
                    <>
                        <EmblaViewport id={viewportId} ref={emblaRef} role="region" aria-label="Polecane przepisy" aria-roledescription="karuzela" tabIndex={0} onKeyDown={handleKeyDown}>
                            <EmblaContainer>
                                {items.map((slide, index) => (
                                    <EmblaSlide key={slide._id} role="group" aria-roledescription="slajd" aria-label={`${index + 1} z ${items.length}`}>
                                        <CarouselItem slide={slide} priority={index === 0} />
                                    </EmblaSlide>
                                ))}
                            </EmblaContainer>
                        </EmblaViewport>

                        {items.length > 1 && (
                            <>
                                <CarouselArrow type="button" aria-label="Poprzednie przepisy" aria-controls={viewportId} onClick={() => emblaApi?.scrollPrev()} sx={{ left: 8 }}>
                                    <ChevronLeftIcon />
                                </CarouselArrow>

                                <CarouselArrow type="button" aria-label="Następne przepisy" aria-controls={viewportId} onClick={() => emblaApi?.scrollNext()} sx={{ right: 8 }}>
                                    <ChevronRightIcon />
                                </CarouselArrow>
                            </>
                        )}
                    </>
                )}
            </CarouselContainer>
        </Section>
    );
}
