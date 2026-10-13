// src/components/Slider/Slider.client.tsx
"use client";

import { useEffect, useRef } from "react";
import EmblaCarousel from "embla-carousel";

type Props = {
    viewportId?: string;
    intervalMs?: number;
};

export default function SliderClient({ viewportId = "slider-viewport", intervalMs = 5000 }: Props) {
    const emblaRef = useRef<ReturnType<typeof EmblaCarousel> | null>(null);

    useEffect(() => {
        const viewport = document.getElementById(viewportId);
        if (!viewport) return;

        const embla = EmblaCarousel(viewport, {
            align: "start",
            loop: true,
        });

        emblaRef.current = embla;

        let timer: number | null = null;

        const startAutoplay = () => {
            timer = window.setInterval(() => {
                try {
                    embla.scrollNext();
                } catch {
                    // ignore
                }
            }, intervalMs);
        };

        startAutoplay();

        const onKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable='true']")) return;

            if (e.key === "ArrowLeft") embla.scrollPrev();
            if (e.key === "ArrowRight") embla.scrollNext();
        };

        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("keydown", onKey);
            if (timer) clearInterval(timer);
            embla.destroy();
            emblaRef.current = null;
        };
    }, [intervalMs, viewportId]);

    return null;
}
