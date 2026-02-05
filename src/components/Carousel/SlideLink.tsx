// src/components/Carousel/SlideLink.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Slide } from "./Carousel.types";

interface SlideLinkProps {
    slide: Slide;
    children: React.ReactNode;
}

export default function SlideLink({ slide, children }: SlideLinkProps) {
    const ref = useRef<HTMLAnchorElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // nie musimy obserwować dalej
                }
            },
            { threshold: 0.5 } // kiedy połowa slajdu jest w viewport
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Link
            ref={ref}
            href={slide.slug ? `/recipes/${slide.slug}` : `/recipes/${slide._id}`}
            prefetch={isVisible} // inteligentny prefetch
        >
            {children}
        </Link>
    );
}
