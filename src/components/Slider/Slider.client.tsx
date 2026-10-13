"use client";

import { useEffect } from "react";
import EmblaCarousel from "embla-carousel";
import useMessage from "@/hooks/useMessage";

interface SliderClientProps {
    viewportId: string;
    intervalMs?: number;
    error?: string | null;
}

export default function SliderClient({ viewportId, intervalMs = 5000, error }: SliderClientProps) {
    const showMessage = useMessage();

    useEffect(() => {
        if (error) {
            showMessage.error(error);
        }
    }, [error, showMessage]);

    useEffect(() => {
        const viewport = document.getElementById(viewportId);
        const root = viewport?.closest("#Slider");

        if (!viewport || !root) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const embla = EmblaCarousel(viewport, {
            align: "start",
            loop: true,
        });

        const prevButton = root.querySelector<HTMLButtonElement>(".slider-prev");
        const nextButton = root.querySelector<HTMLButtonElement>(".slider-next");

        let timer: number | null = null;
        let paused = false;

        const stopAutoplay = () => {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        };

        const startAutoplay = () => {
            stopAutoplay();

            if (paused || reducedMotion.matches) return;

            timer = window.setInterval(() => {
                embla.scrollNext();
            }, intervalMs);
        };

        const pause = () => {
            paused = true;
            stopAutoplay();
        };

        const resume = () => {
            paused = false;
            startAutoplay();
        };

        const onPrev = () => {
            embla.scrollPrev();
        };

        const onNext = () => {
            embla.scrollNext();
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable='true']")) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                embla.scrollPrev();
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                embla.scrollNext();
            }
        };

        prevButton?.addEventListener("click", onPrev);
        nextButton?.addEventListener("click", onNext);

        viewport.addEventListener("keydown", onKeyDown);
        root.addEventListener("mouseenter", pause);
        root.addEventListener("mouseleave", resume);
        root.addEventListener("focusin", pause);
        root.addEventListener("focusout", resume);
        reducedMotion.addEventListener("change", startAutoplay);

        startAutoplay();

        return () => {
            stopAutoplay();

            prevButton?.removeEventListener("click", onPrev);
            nextButton?.removeEventListener("click", onNext);

            viewport.removeEventListener("keydown", onKeyDown);
            root.removeEventListener("mouseenter", pause);
            root.removeEventListener("mouseleave", resume);
            root.removeEventListener("focusin", pause);
            root.removeEventListener("focusout", resume);
            reducedMotion.removeEventListener("change", startAutoplay);

            embla.destroy();
        };
    }, [intervalMs, viewportId]);

    return null;
}
