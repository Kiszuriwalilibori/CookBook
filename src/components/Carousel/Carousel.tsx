"use client";

import React from "react";
import { useRouter } from "next/navigation";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import CarouselLib from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { EmptyState } from "@/components/EmptyState";
import { CarouselContainer, Section } from "./Carousel.styles";
import { Slide } from "./Carousel.types";

import CarouselItem from "./Carousel.item";

import useDelayedCondition from "@/hooks/useDelayedCondition";
import { LoadingIndicator } from "@/components";
import { useCarouselSlides } from "./useCarouselSlides";

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

export const DELAY = 500;
export const DURATION = 1000;

export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
    const { items, status } = useCarouselSlides({
        count,
        initialSlides,
    });
    const showLoading = useDelayedCondition(status === "loading", DELAY, DURATION);

    const router = useRouter();

    return (
        <Section id={"Carousel.Section"}>
            <CarouselContainer>
                {showLoading && <LoadingIndicator prompt="Ładowanie przepisów..." centeredInParent={true} />}
                {status === "empty" && <EmptyState icon={<SearchOffIcon />} title="Nie ma polecanych przepisów" description="Sprawdź później albo pobierz wszystkie" actionLabel="Browse recipes" onAction={() => router.push("/recipes")} />}
                {status === "error" && <EmptyState icon={<SearchOffIcon />} title="Nie udało się załadować przepisów" description="Spróbuj ponownie później" />}
                {status === "success" && items && (
                    <CarouselLib responsive={responsive} infinite autoPlay autoPlaySpeed={intervalMs} arrows keyBoardControl pauseOnHover>
                        {items.map((slide, index) => (
                            <CarouselItem key={slide._id} slide={slide} priority={index === 0} />
                        ))}
                    </CarouselLib>
                )}
            </CarouselContainer>
        </Section>
    );
}

// todo parseApiResponse są zbliżone funkcje tu i tam parseBody ujednolicić
