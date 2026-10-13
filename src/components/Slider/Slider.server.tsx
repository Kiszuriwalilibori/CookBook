"use client";

import { useEffect, useRef } from "react";
import EmblaCarousel from "embla-carousel";

type Props = {
    viewportId?: string;
    intervalMs?: number;
};

export default function SliderClient({ viewportId = "slider-viewport", intervalMs = 5000 }: Props) {
    const emblaRef = useRef<ReturnType<typeof EmblaCarousel> | null>(null);
    const autoplayTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const viewport = document.getElementById(viewportId);
        if (!viewport) return;

        const embla = EmblaCarousel(viewport, { align: "start", loop: true });
        emblaRef.current = embla;

        // Autoplay
        const startAutoplay = () => {
            stopAutoplay();
            autoplayTimerRef.current = window.setInterval(() => {
                try {
                    embla.scrollNext();
                } catch {
                    // ignore
                }
            }, intervalMs);
        };

        const stopAutoplay = () => {
            if (autoplayTimerRef.current !== null) {
                clearInterval(autoplayTimerRef.current);
                autoplayTimerRef.current = null;
            }
        };

        startAutoplay();

        // arrow buttons
        const prevBtn = viewport.querySelector<HTMLButtonElement>(".slider-prev");
        const nextBtn = viewport.querySelector<HTMLButtonElement>(".slider-next");

        const onPrev = (e?: Event) => {
            e?.preventDefault();
            embla.scrollPrev();
        };
        const onNext = (e?: Event) => {
            e?.preventDefault();
            embla.scrollNext();
        };

        prevBtn?.addEventListener("click", onPrev);
        nextBtn?.addEventListener("click", onNext);

        // stop autoplay on mouseenter, resume on mouseleave
        const onMouseEnter = () => stopAutoplay();
        const onMouseLeave = () => startAutoplay();

        viewport.addEventListener("mouseenter", onMouseEnter);
        viewport.addEventListener("mouseleave", onMouseLeave);

        // keyboard handlers
        const onKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable='true']")) return;
            if (e.key === "ArrowLeft") embla.scrollPrev();
            if (e.key === "ArrowRight") embla.scrollNext();
        };
        window.addEventListener("keydown", onKey);

        return () => {
            prevBtn?.removeEventListener("click", onPrev);
            nextBtn?.removeEventListener("click", onNext);
            viewport.removeEventListener("mouseenter", onMouseEnter);
            viewport.removeEventListener("mouseleave", onMouseLeave);
            window.removeEventListener("keydown", onKey);
            stopAutoplay();
            embla.destroy();
            emblaRef.current = null;
        };
    }, [viewportId, intervalMs]);

    return null;
}
