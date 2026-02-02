// "use client";

// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";
// import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// type Slide = {
//     _id: string;
//     slug?: string | null;
//     imageUrl?: string | null;
//     title?: string | null;
// };

// interface HeroCarouselProps {
//     count?: number;
//     intervalMs?: number;
// }

// // Breakpoints: 3 slides on >=1200, 2 on >=900, 1 otherwise
// const BREAKPOINTS = [
//     { min: 1200, slides: 3 },
//     { min: 900, slides: 2 },
//     { min: 0, slides: 1 },
// ];

// function getSlidesToShowForWidth(width: number) {
//     for (const b of BREAKPOINTS) {
//         if (width >= b.min) return b.slides;
//     }
//     return 1;
// }

// function useSlidesToShow() {
//     const [slidesToShow, setSlidesToShow] = useState<number>(() => (typeof window !== "undefined" ? getSlidesToShowForWidth(window.innerWidth) : 1));
//     useEffect(() => {
//         function onResize() {
//             setSlidesToShow(getSlidesToShowForWidth(window.innerWidth));
//         }
//         window.addEventListener("resize", onResize);
//         return () => window.removeEventListener("resize", onResize);
//     }, []);
//     return slidesToShow;
// }

// function isPlainObject(v: unknown): v is Record<string, unknown> {
//     return typeof v === "object" && v !== null && !Array.isArray(v);
// }
// function isSlide(v: unknown): v is Slide {
//     if (!isPlainObject(v)) return false;
//     const o = v as Record<string, unknown>;
//     if (typeof o._id !== "string") return false;
//     if (o.slug !== undefined && o.slug !== null && typeof o.slug !== "string") return false;
//     if (o.imageUrl !== undefined && o.imageUrl !== null && typeof o.imageUrl !== "string") return false;
//     if (o.title !== undefined && o.title !== null && typeof o.title !== "string") return false;
//     return true;
// }
// function isSlideArray(v: unknown): v is Slide[] {
//     return Array.isArray(v) && v.every(isSlide);
// }
// function normalizeResponseToSlides(parsed: unknown): Slide[] | null {
//     if (isSlideArray(parsed)) return parsed;
//     if (!isPlainObject(parsed)) return null;
//     const p = parsed as Record<string, unknown>;
//     if (isSlideArray(p.items)) return p.items;
//     if (isSlideArray(p.result)) return p.result;
//     if (isSlideArray(p.data)) return p.data;
//     if (isSlideArray(p.recipes)) return p.recipes;
//     if (isSlideArray(p.sampleStrict) && (p.sampleStrict as Slide[]).length > 0) return p.sampleStrict as Slide[];
//     if (isSlideArray(p.sampleStatusOnly) && (p.sampleStatusOnly as Slide[]).length > 0) return p.sampleStatusOnly as Slide[];
//     if (isSlide(p)) return [p];
//     return null;
// }

// export default function HeroCarousel({ count = 5, intervalMs = 5000 }: HeroCarouselProps) {
//     const [items, setItems] = useState<Slide[] | null>(null);
//     const [error, setError] = useState<string | null>(null);

//     const slidesToShowViewport = useSlidesToShow();
//     const [current, setCurrent] = useState<number>(0);
//     const [isTransitioning, setIsTransitioning] = useState(false);
//     const timerRef = useRef<number | null>(null);

//     // Fetch slides
//     useEffect(() => {
//         let mounted = true;
//         async function fetchSlides() {
//             try {
//                 const url = `${window.location.origin}/api/recipes/random?count=${count}`;
//                 const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
//                 const text = await res.text();
//                 let parsed: unknown = null;
//                 try {
//                     parsed = text ? JSON.parse(text) : null;
//                 } catch {
//                     parsed = null;
//                 }
//                 if (!mounted) return;
//                 const slides = normalizeResponseToSlides(parsed);
//                 if (slides === null) {
//                     setError("Nieoczekiwany format odpowiedzi z serwera");
//                     setItems([]);
//                     return;
//                 }
//                 setItems(slides);
//                 setError(null);
//             } catch (err) {
//                 console.error("HeroCarousel fetch error:", err);
//                 if (!mounted) return;
//                 setError("Błąd pobierania polecanych przepisów");
//                 setItems([]);
//             }
//         }
//         fetchSlides();
//         return () => {
//             mounted = false;
//         };
//     }, [count]);

//     // Effective slides to show
//     const effectiveSlidesToShow = useMemo(() => {
//         if (!items || items.length === 0) return slidesToShowViewport;
//         return Math.min(slidesToShowViewport, items.length);
//     }, [slidesToShowViewport, items]);

//     // Build extended slides with K clones (K = effectiveSlidesToShow)
//     const extendedSlides = useMemo(() => {
//         if (!items || items.length === 0) return [];
//         const N = items.length;
//         const K = effectiveSlidesToShow;
//         if (N <= K) return [...items];
//         const head = items.slice(0, K);
//         const tail = items.slice(N - K, N);
//         return [...tail, ...items, ...head];
//     }, [items, effectiveSlidesToShow]);

//     // Set initial index to first real slide (K)
//     useEffect(() => {
//         if (!extendedSlides || extendedSlides.length === 0) return;
//         const K = effectiveSlidesToShow;
//         setCurrent(extendedSlides.length > K ? K : 0);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [extendedSlides.length]);

//     // Stable next/prev
//     const handleNext = useCallback(() => {
//         if (!extendedSlides.length) return;
//         setIsTransitioning(true);
//         setCurrent(c => c + 1);
//     }, [extendedSlides.length]);

//     const handlePrev = useCallback(() => {
//         if (!extendedSlides.length) return;
//         setIsTransitioning(true);
//         setCurrent(c => c - 1);
//     }, [extendedSlides.length]);

//     // Auto-rotate
//     useEffect(() => {
//         function startAutoRotate() {
//             stopAutoRotate();
//             if (!extendedSlides || extendedSlides.length <= effectiveSlidesToShow) return;
//             timerRef.current = window.setInterval(() => {
//                 handleNext();
//             }, intervalMs);
//         }
//         function stopAutoRotate() {
//             if (timerRef.current !== null) {
//                 clearInterval(timerRef.current);
//                 timerRef.current = null;
//             }
//         }
//         startAutoRotate();
//         return () => {
//             stopAutoRotate();
//         };
//     }, [extendedSlides, effectiveSlidesToShow, handleNext, intervalMs]);

//     // After transition, if we're on clones, jump to corresponding real slide without animation
//     function handleTransitionEnd() {
//         if (!extendedSlides || extendedSlides.length === 0) {
//             setIsTransitioning(false);
//             return;
//         }
//         const N = items ? items.length : 0;
//         const K = effectiveSlidesToShow;
//         if (N <= K) {
//             setIsTransitioning(false);
//             return;
//         }
//         const firstReal = K;
//         const lastReal = K + N - 1;
//         if (current > lastReal) {
//             // moved past last clone -> jump to firstReal
//             setIsTransitioning(false);
//             setCurrent(firstReal);
//         } else if (current < firstReal) {
//             // moved before first clone -> jump to lastReal
//             setIsTransitioning(false);
//             setCurrent(lastReal);
//         } else {
//             setIsTransitioning(false);
//         }
//     }

//     // compute translate
//     const slideWidthPercent = 100 / effectiveSlidesToShow;
//     const translateX = -(current * slideWidthPercent);

//     // Dots
//     const dots = useMemo(() => {
//         const N = items ? items.length : 0;
//         if (!N) return [];
//         return Array.from({ length: N }, (_, i) => i);
//     }, [items]);

//     const activeDotIndex = useMemo(() => {
//         const N = items ? items.length : 0;
//         const K = effectiveSlidesToShow;
//         if (!N) return 0;
//         const idx = (((current - K) % N) + N) % N;
//         return idx;
//     }, [current, effectiveSlidesToShow, items]);

//     const goToDot = useCallback(
//         (dotIndex: number) => {
//             if (!items || items.length === 0) return;
//             const K = effectiveSlidesToShow;
//             setIsTransitioning(true);
//             setCurrent(K + dotIndex);
//         },
//         [effectiveSlidesToShow, items]
//     );

//     // keyboard nav
//     useEffect(() => {
//         function onKey(e: KeyboardEvent) {
//             if (e.key === "ArrowLeft") {
//                 handlePrev();
//             } else if (e.key === "ArrowRight") {
//                 handleNext();
//             }
//         }
//         window.addEventListener("keydown", onKey);
//         return () => window.removeEventListener("keydown", onKey);
//     }, [handleNext, handlePrev]);

//     // Render states
//     if (items === null) {
//         return (
//             <Box sx={{ my: 4, textAlign: "center" }}>
//                 <Typography variant="h6">Ładowanie polecanych przepisów...</Typography>
//             </Box>
//         );
//     }
//     if (error) {
//         return (
//             <Box sx={{ my: 4, textAlign: "center" }}>
//                 <Typography variant="h6" color="error">
//                     {error}
//                 </Typography>
//             </Box>
//         );
//     }
//     if (!items || items.length === 0) {
//         return (
//             <Box sx={{ my: 4, textAlign: "center" }}>
//                 <Typography variant="h6">Brak polecanych przepisów.</Typography>
//             </Box>
//         );
//     }

//     // GOLDEN RATIO: height = width / φ -> padding-top = (1/φ)*100 ≈ 61.8%
//     const goldenPaddingTop = "61.8%";

//     return (
//         <Box
//             component="section"
//             aria-roledescription="carousel"
//             aria-label="Lider - losowe przepisy"
//             sx={{ position: "relative", my: 4 }}
//             onMouseEnter={() => {
//                 if (timerRef.current !== null) {
//                     clearInterval(timerRef.current);
//                     timerRef.current = null;
//                 }
//             }}
//             onMouseLeave={() => {
//                 if (!extendedSlides || extendedSlides.length <= effectiveSlidesToShow) return;
//                 timerRef.current = window.setInterval(() => handleNext(), intervalMs);
//             }}
//         >
//             <Box sx={{ overflow: "hidden", width: "100%" }}>
//                 <Box
//                     onTransitionEnd={handleTransitionEnd}
//                     sx={{
//                         display: "flex",
//                         transform: `translateX(${translateX}%)`,
//                         transition: isTransitioning ? "transform 480ms ease" : "none",
//                     }}
//                 >
//                     {extendedSlides.map((slide, idx) => (
//                         <Box
//                             key={`${slide._id}-${idx}`}
//                             sx={{
//                                 flex: `0 0 ${slideWidthPercent}%`,
//                                 boxSizing: "border-box",
//                                 px: { xs: 0.5, md: 0.5 },
//                             }}
//                         >
//                             <Card sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
//                                 <Link href={slide.slug ? `/recipes/${slide.slug}` : `/recipes/${slide._id}`} style={{ color: "inherit", textDecoration: "none" }}>
//                                     {/* Aspect box using padding-top to enforce golden ratio */}
//                                     <Box sx={{ position: "relative", width: "100%", paddingTop: goldenPaddingTop, background: "#f4f4f4" }}>
//                                         <Box
//                                             component="img"
//                                             src={slide.imageUrl || "/placeholder.png"}
//                                             alt={slide.title ?? "Przepis"}
//                                             sx={{
//                                                 position: "absolute",
//                                                 top: 0,
//                                                 left: 0,
//                                                 width: "100%",
//                                                 height: "100%",
//                                                 objectFit: "cover",
//                                                 display: "block",
//                                             }}
//                                         />
//                                         <CardContent
//                                             sx={{
//                                                 position: "absolute",
//                                                 left: 0,
//                                                 right: 0,
//                                                 bottom: 0,
//                                                 display: "flex",
//                                                 justifyContent: "center",
//                                                 alignItems: "center",
//                                                 p: 1,
//                                                 background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
//                                                 color: "common.white",
//                                             }}
//                                         >
//                                             <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: "center" }}>
//                                                 {slide.title ?? "Bez tytułu"}
//                                             </Typography>
//                                         </CardContent>
//                                     </Box>
//                                 </Link>
//                             </Card>
//                         </Box>
//                     ))}
//                 </Box>
//             </Box>

//             {/* Controls */}
//             <IconButton
//                 aria-label="Poprzedni"
//                 onClick={() => {
//                     handlePrev();
//                 }}
//                 sx={{ position: "absolute", top: "50%", left: 8, transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.9)" }}
//             >
//                 <ArrowBackIosNewIcon />
//             </IconButton>

//             <IconButton
//                 aria-label="Następny"
//                 onClick={() => {
//                     handleNext();
//                 }}
//                 sx={{ position: "absolute", top: "50%", right: 8, transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.9)" }}
//             >
//                 <ArrowForwardIosIcon />
//             </IconButton>

//             {/* Pagination dots */}
//             <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
//                 {dots.map(d => (
//                     <Box
//                         key={d}
//                         component="button"
//                         onClick={() => goToDot(d)}
//                         aria-label={`Przejdź do slajdu ${d + 1}`}
//                         sx={{
//                             width: 10,
//                             height: 10,
//                             borderRadius: "50%",
//                             background: d === activeDotIndex ? "#1976d2" : "#CCC",
//                             border: "none",
//                             padding: 0,
//                             cursor: "pointer",
//                         }}
//                     />
//                 ))}
//             </Box>
//         </Box>
//     );
// }

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type Slide = {
    _id: string;
    slug?: string | null;
    imageUrl?: string | null;
    title?: string | null;
};

interface HeroCarouselProps {
    count?: number;
    intervalMs?: number;
}

// Breakpoints: 3 slides on >=1200, 2 on >=900, 1 otherwise
const BREAKPOINTS = [
    { min: 1200, slides: 3 },
    { min: 900, slides: 2 },
    { min: 0, slides: 1 },
];

function getSlidesToShowForWidth(width: number) {
    for (const b of BREAKPOINTS) {
        if (width >= b.min) return b.slides;
    }
    return 1;
}

function useSlidesToShow() {
    const [slidesToShow, setSlidesToShow] = useState<number>(() => (typeof window !== "undefined" ? getSlidesToShowForWidth(window.innerWidth) : 1));
    useEffect(() => {
        function onResize() {
            setSlidesToShow(getSlidesToShowForWidth(window.innerWidth));
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return slidesToShow;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isSlide(v: unknown): v is Slide {
    if (!isPlainObject(v)) return false;
    const o = v as Record<string, unknown>;
    if (typeof o._id !== "string") return false;
    if (o.slug !== undefined && o.slug !== null && typeof o.slug !== "string") return false;
    if (o.imageUrl !== undefined && o.imageUrl !== null && typeof o.imageUrl !== "string") return false;
    if (o.title !== undefined && o.title !== null && typeof o.title !== "string") return false;
    return true;
}
function isSlideArray(v: unknown): v is Slide[] {
    return Array.isArray(v) && v.every(isSlide);
}
function normalizeResponseToSlides(parsed: unknown): Slide[] | null {
    if (isSlideArray(parsed)) return parsed;
    if (!isPlainObject(parsed)) return null;
    const p = parsed as Record<string, unknown>;
    if (isSlideArray(p.items)) return p.items;
    if (isSlideArray(p.result)) return p.result;
    if (isSlideArray(p.data)) return p.data;
    if (isSlideArray(p.recipes)) return p.recipes;
    if (isSlideArray(p.sampleStrict) && (p.sampleStrict as Slide[]).length > 0) return p.sampleStrict as Slide[];
    if (isSlideArray(p.sampleStatusOnly) && (p.sampleStatusOnly as Slide[]).length > 0) return p.sampleStatusOnly as Slide[];
    if (isSlide(p)) return [p];
    return null;
}

export default function HeroCarousel({ count = 5, intervalMs = 5000 }: HeroCarouselProps) {
    const [items, setItems] = useState<Slide[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const slidesToShowViewport = useSlidesToShow();
    const [current, setCurrent] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Fetch slides
    useEffect(() => {
        let mounted = true;
        async function fetchSlides() {
            try {
                const url = `${window.location.origin}/api/recipes/random?count=${count}`;
                const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
                const text = await res.text();
                let parsed: unknown = null;
                try {
                    parsed = text ? JSON.parse(text) : null;
                } catch {
                    parsed = null;
                }
                if (!mounted) return;
                const slides = normalizeResponseToSlides(parsed);
                if (slides === null) {
                    setError("Nieoczekiwany format odpowiedzi z serwera");
                    setItems([]);
                    return;
                }
                setItems(slides);
                setError(null);
            } catch (err) {
                console.error("HeroCarousel fetch error:", err);
                if (!mounted) return;
                setError("Błąd pobierania polecanych przepisów");
                setItems([]);
            }
        }
        fetchSlides();
        return () => {
            mounted = false;
        };
    }, [count]);

    // Effective slides to show
    const effectiveSlidesToShow = useMemo(() => {
        if (!items || items.length === 0) return slidesToShowViewport;
        return Math.min(slidesToShowViewport, items.length);
    }, [slidesToShowViewport, items]);

    // Build extended slides with K clones (K = effectiveSlidesToShow)
    const extendedSlides = useMemo(() => {
        if (!items || items.length === 0) return [];
        const N = items.length;
        const K = effectiveSlidesToShow;
        if (N <= K) return [...items];
        const head = items.slice(0, K);
        const tail = items.slice(N - K, N);
        return [...tail, ...items, ...head];
    }, [items, effectiveSlidesToShow]);

    // Set initial index to first real slide (K)
    useEffect(() => {
        if (!extendedSlides || extendedSlides.length === 0) return;
        const K = effectiveSlidesToShow;
        setCurrent(extendedSlides.length > K ? K : 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [extendedSlides.length]);

    // Stable next/prev
    const handleNext = useCallback(() => {
        if (!extendedSlides.length) return;
        setIsTransitioning(true);
        setCurrent(c => c + 1);
    }, [extendedSlides.length]);

    const handlePrev = useCallback(() => {
        if (!extendedSlides.length) return;
        setIsTransitioning(true);
        setCurrent(c => c - 1);
    }, [extendedSlides.length]);

    // Auto-rotate
    useEffect(() => {
        function startAutoRotate() {
            stopAutoRotate();
            if (!extendedSlides || extendedSlides.length <= effectiveSlidesToShow) return;
            timerRef.current = window.setInterval(() => {
                handleNext();
            }, intervalMs);
        }
        function stopAutoRotate() {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
        startAutoRotate();
        return () => {
            stopAutoRotate();
        };
    }, [extendedSlides, effectiveSlidesToShow, handleNext, intervalMs]);

    // After transition, if we're on clones, jump to corresponding real slide without animation
    function handleTransitionEnd() {
        if (!extendedSlides || extendedSlides.length === 0) {
            setIsTransitioning(false);
            return;
        }
        const N = items ? items.length : 0;
        const K = effectiveSlidesToShow;
        if (N <= K) {
            setIsTransitioning(false);
            return;
        }
        const firstReal = K;
        const lastReal = K + N - 1;
        if (current > lastReal) {
            // moved past last clone -> jump to firstReal
            setIsTransitioning(false);
            setCurrent(firstReal);
        } else if (current < firstReal) {
            // moved before first clone -> jump to lastReal
            setIsTransitioning(false);
            setCurrent(lastReal);
        } else {
            setIsTransitioning(false);
        }
    }

    // compute translate
    const slideWidthPercent = 100 / effectiveSlidesToShow;
    const translateX = -(current * slideWidthPercent);

    // keyboard nav
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "ArrowLeft") {
                handlePrev();
            } else if (e.key === "ArrowRight") {
                handleNext();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [handleNext, handlePrev]);

    // Render states
    if (items === null) {
        return (
            <Box sx={{ my: 4, textAlign: "center" }}>
                <Typography variant="h6">Ładowanie polecanych przepisów...</Typography>
            </Box>
        );
    }
    if (error) {
        return (
            <Box sx={{ my: 4, textAlign: "center" }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }
    if (!items || items.length === 0) {
        return (
            <Box sx={{ my: 4, textAlign: "center" }}>
                <Typography variant="h6">Brak polecanych przepisów.</Typography>
            </Box>
        );
    }

    // GOLDEN RATIO: height = width / φ -> padding-top = (1/φ)*100 ≈ 61.8%
    const goldenPaddingTop = "61.8%";

    return (
        <Box
            component="section"
            aria-roledescription="carousel"
            aria-label="Lider - losowe przepisy"
            sx={{ position: "relative", my: 4 }}
            onMouseEnter={() => {
                if (timerRef.current !== null) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            }}
            onMouseLeave={() => {
                if (!extendedSlides || extendedSlides.length <= effectiveSlidesToShow) return;
                timerRef.current = window.setInterval(() => handleNext(), intervalMs);
            }}
        >
            <Box sx={{ overflow: "hidden", width: "100%" }}>
                <Box
                    onTransitionEnd={handleTransitionEnd}
                    sx={{
                        display: "flex",
                        transform: `translateX(${translateX}%)`,
                        transition: isTransitioning ? "transform 480ms ease" : "none",
                    }}
                >
                    {extendedSlides.map((slide, idx) => (
                        <Box
                            key={`${slide._id}-${idx}`}
                            sx={{
                                flex: `0 0 ${slideWidthPercent}%`,
                                boxSizing: "border-box",
                                px: { xs: 0.5, md: 0.5 },
                            }}
                        >
                            <Card sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
                                <Link href={slide.slug ? `/recipes/${slide.slug}` : `/recipes/${slide._id}`} style={{ color: "inherit", textDecoration: "none" }}>
                                    {/* Aspect box using padding-top to enforce golden ratio */}
                                    <Box sx={{ position: "relative", width: "100%", paddingTop: goldenPaddingTop, background: "#f4f4f4" }}>
                                        <Box
                                            component="img"
                                            src={slide.imageUrl || "/placeholder.png"}
                                            alt={slide.title ?? "Przepis"}
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />
                                        <CardContent
                                            sx={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                p: 1,
                                                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
                                                color: "common.white",
                                            }}
                                        >
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: "center" }}>
                                                {slide.title ?? "Bez tytułu"}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Link>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Controls */}
            <IconButton
                aria-label="Poprzedni"
                onClick={() => {
                    handlePrev();
                }}
                sx={{ position: "absolute", top: "50%", left: 8, transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.9)" }}
            >
                <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton
                aria-label="Następny"
                onClick={() => {
                    handleNext();
                }}
                sx={{ position: "absolute", top: "50%", right: 8, transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.9)" }}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
}