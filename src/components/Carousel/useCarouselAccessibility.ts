"use client";

import { useEffect } from "react";

export const useCarouselAccessibility = () => {
    useEffect(() => {
        const updateFocusableElements = () => {
            document.querySelectorAll<HTMLElement>(".react-multi-carousel-item").forEach(slide => {
                const isHidden = slide.getAttribute("aria-hidden") === "true";

                slide.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(link => {
                    if (isHidden) {
                        link.setAttribute("tabindex", "-1");
                    } else {
                        link.removeAttribute("tabindex");
                    }
                });
            });
        };

        updateFocusableElements();

        const observer = new MutationObserver(updateFocusableElements);

        observer.observe(document.body, {
            subtree: true,
            attributes: true,
            attributeFilter: ["aria-hidden"],
        });

        return () => observer.disconnect();
    }, []);
};
