// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import SearchOffIcon from "@mui/icons-material/SearchOff";
// import CarouselLib from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

// import { EmptyState } from "@/components/EmptyState";
// import { CarouselError } from "./Carousel.states";
// import { Section } from "./Carousel.styles";
// import { Slide } from "./Carousel.types";

// import CarouselLoader from "./Carousel.loader";
// import CarouselItem from "./Carousel.item";

// interface CarouselProps {
//     count?: number;
//     intervalMs?: number;
//     initialSlides?: Slide[] | null;
// }

// const responsive = {
//     desktop: { breakpoint: { max: 3000, min: 1200 }, items: 3 },
//     tablet: { breakpoint: { max: 1200, min: 900 }, items: 2 },
//     mobile: { breakpoint: { max: 900, min: 0 }, items: 1 },
// };

// export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
//     const [items, setItems] = useState<Slide[] | null>(initialSlides);
//     const [error, setError] = useState<string | null>(null);
//     const [initialRenderReady, setInitialRenderReady] = useState(false);
//     const router = useRouter();

//     // Helper: minimalna liczba obrazków dla aktualnego ekranu
//     const getVisibleCount = () => {
//         if (typeof window === "undefined") return 1; // SSR fallback
//         const width = window.innerWidth;
//         if (width >= 1200) return 3;
//         if (width >= 900) return 2;
//         return 1;
//     };

//     // Fetch slides
//     useEffect(() => {
//         if (initialSlides) return;

//         let mounted = true;

//         async function fetchSlides() {
//             try {
//                 const res = await fetch(`/api/recipes/random?count=${count}`, { cache: "no-store" });
//                 const data = await res.json();

//                 if (!mounted) return;

//                 if (Array.isArray(data)) setItems(data);
//                 else if (Array.isArray(data?.items)) setItems(data.items);
//                 else setItems([]);
//             } catch (e) {
//                 console.error(e);
//                 if (mounted) {
//                     setError("Failed to load carousel");
//                     setItems([]);
//                 }
//             }
//         }

//         fetchSlides();
//         return () => {
//             mounted = false;
//         };
//     }, [count, initialSlides]);

//     // Load images i minimalna liczba do pierwszego renderu
//     useEffect(() => {
//         if (!items || items.length === 0) {
//             setInitialRenderReady(true);
//             return;
//         }

//         const visibleCount = getVisibleCount();
//         let mounted = true;
//         let loadedCount = 0;

//         setInitialRenderReady(false);

//         items.forEach(slide => {
//             const img = new Image();
//             img.src = slide.imageUrl || "/placeholder.png";
//             img.onload = img.onerror = () => {
//                 if (!mounted) return;
//                 loadedCount += 1;

//                 // Minimalna liczba obrazków gotowa → render karuzeli
//                 if (loadedCount >= visibleCount) {
//                     setInitialRenderReady(true);
//                 }
//             };
//         });

//         return () => {
//             mounted = false;
//         };
//     }, [items]);

//     // Spinner dopóki minimalna liczba obrazków się nie załaduje
//     if (!items || !initialRenderReady) {
//         return <CarouselLoader />;
//     }

//     if (error) {
//         return <CarouselError message={error} />;
//     }

//     if (items.length === 0) {
//         return <EmptyState icon={<SearchOffIcon />} title="No featured recipes" description="Check back later or explore all recipes" actionLabel="Browse recipes" onAction={() => router.push("/recipes")} />;
//     }

//     return (
//         <Section>
//             <CarouselLib responsive={responsive} infinite autoPlay autoPlaySpeed={intervalMs} arrows keyBoardControl pauseOnHover>
//                 {items.map(slide => (
//                     <CarouselItem key={slide._id} slide={slide} />
//                 ))}
//             </CarouselLib>
//         </Section>
//     );
// }
// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { Box } from "@mui/material";
// import SearchOffIcon from "@mui/icons-material/SearchOff";
// import CarouselLib from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

// import { EmptyState } from "@/components/EmptyState";
// import { CarouselError } from "./Carousel.states";
// import { Section } from "./Carousel.styles";
// import { Slide } from "./Carousel.types";

// import CarouselLoader from "./Carousel.loader";
// import CarouselItem from "./Carousel.item";

// interface CarouselProps {
//     count?: number;
//     intervalMs?: number;
//     initialSlides?: Slide[] | null;
// }

// const responsive = {
//     desktop: { breakpoint: { max: 3000, min: 1200 }, items: 3 },
//     tablet: { breakpoint: { max: 1200, min: 900 }, items: 2 },
//     mobile: { breakpoint: { max: 900, min: 0 }, items: 1 },
// };

// export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
//     const [items, setItems] = useState<Slide[] | null>(initialSlides);
//     const [error, setError] = useState<string | null>(null);
//     const [initialRenderReady, setInitialRenderReady] = useState(false);
//     const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
//     const [fadeIn, setFadeIn] = useState(false);
//     const router = useRouter();

//     // Minimalna liczba obrazków dla aktualnego ekranu
//     const getVisibleCount = () => {
//         if (typeof window === "undefined") return 1;
//         const width = window.innerWidth;
//         if (width >= 1200) return 3;
//         if (width >= 900) return 2;
//         return 1;
//     };

//     // Fetch slides
//     useEffect(() => {
//         if (initialSlides) return;

//         let mounted = true;

//         async function fetchSlides() {
//             try {
//                 const res = await fetch(`/api/recipes/random?count=${count}`, { cache: "no-store" });
//                 const data = await res.json();

//                 if (!mounted) return;

//                 if (Array.isArray(data)) setItems(data);
//                 else if (Array.isArray(data?.items)) setItems(data.items);
//                 else setItems([]);
//             } catch (e) {
//                 console.error(e);
//                 if (mounted) {
//                     setError("Failed to load carousel");
//                     setItems([]);
//                 }
//             }
//         }

//         fetchSlides();
//         return () => {
//             mounted = false;
//         };
//     }, [count, initialSlides]);

//     // Load images i minimalna liczba do pierwszego renderu
//     useEffect(() => {
//         if (!items || items.length === 0) {
//             setInitialRenderReady(true);
//             return;
//         }

//         const visibleCount = getVisibleCount();
//         let mounted = true;
//         let ready = false; // lokalna flaga minimalnej liczby obrazków

//         setInitialRenderReady(false);
//         setImagesLoaded(new Set());
//         setFadeIn(false);

//         items.forEach(slide => {
//             const img = new Image();
//             img.src = slide.imageUrl || "/placeholder.png";
//             img.onload = img.onerror = () => {
//                 if (!mounted) return;

//                 setImagesLoaded(prev => {
//                     const next = new Set(prev);
//                     next.add(slide._id);

//                     // Minimalna liczba obrazków gotowa → render karuzeli
//                     if (!ready && next.size >= visibleCount) {
//                         ready = true;
//                         setInitialRenderReady(true);
//                         setTimeout(() => setFadeIn(true), 50); // delikatny fade-in
//                     }

//                     return next;
//                 });
//             };
//         });

//         return () => {
//             mounted = false;
//         };
//     }, [items]);

//     // Spinner dopóki minimalna liczba obrazków się nie załaduje
//     if (!items || !initialRenderReady) {
//         return <CarouselLoader />;
//     }

//     if (error) {
//         return <CarouselError message={error} />;
//     }

//     if (items.length === 0) {
//         return <EmptyState icon={<SearchOffIcon />} title="No featured recipes" description="Check back later or explore all recipes" actionLabel="Browse recipes" onAction={() => router.push("/recipes")} />;
//     }

//     // Render karuzeli z podmienianiem placeholderów dla obrazków w tle i fade-in
//     return (
//         <Section>
//             <Box
//                 sx={{
//                     opacity: fadeIn ? 1 : 0,
//                     transition: "opacity 0.6s ease-in-out",
//                 }}
//             >
//                 <CarouselLib responsive={responsive} infinite autoPlay autoPlaySpeed={intervalMs} arrows keyBoardControl pauseOnHover>
//                     {items.map(slide => (
//                         <CarouselItem key={slide._id} slide={imagesLoaded.has(slide._id) ? slide : { ...slide, imageUrl: "/placeholder.png" }} />
//                     ))}
//                 </CarouselLib>
//             </Box>
//         </Section>
//     );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { Box } from "@mui/material";
// import SearchOffIcon from "@mui/icons-material/SearchOff";
// import CarouselLib from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

// import { EmptyState } from "@/components/EmptyState";
// import { CarouselError } from "./Carousel.states";
// import { Section } from "./Carousel.styles";
// import { Slide } from "./Carousel.types";

// import CarouselLoader from "./Carousel.loader";
// import CarouselItem from "./Carousel.item";

// interface CarouselProps {
//     count?: number;
//     intervalMs?: number;
//     initialSlides?: Slide[] | null;
// }

// const responsive = {
//     desktop: { breakpoint: { max: 3000, min: 1200 }, items: 3 },
//     tablet: { breakpoint: { max: 1200, min: 900 }, items: 2 },
//     mobile: { breakpoint: { max: 900, min: 0 }, items: 1 },
// };

// export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
//     const [items, setItems] = useState<Slide[] | null>(initialSlides);
//     const [error, setError] = useState<string | null>(null);
//     const [initialRenderReady, setInitialRenderReady] = useState(false);
//     const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
//     const [fadeIn, setFadeIn] = useState(false);
//     const router = useRouter();

//     // Minimalna liczba obrazków dla aktualnego ekranu
//     const getVisibleCount = () => {
//         if (typeof window === "undefined") return 1;
//         const width = window.innerWidth;
//         if (width >= 1200) return 3;
//         if (width >= 900) return 2;
//         return 1;
//     };

//     // Fetch slides
//     useEffect(() => {
//         if (initialSlides) return;

//         let mounted = true;

//         async function fetchSlides() {
//             try {
//                 const res = await fetch(`/api/recipes/random?count=${count}`, { cache: "no-store" });
//                 const data = await res.json();

//                 if (!mounted) return;

//                 if (Array.isArray(data)) setItems(data);
//                 else if (Array.isArray(data?.items)) setItems(data.items);
//                 else setItems([]);
//             } catch (e) {
//                 console.error(e);
//                 if (mounted) {
//                     setError("Failed to load carousel");
//                     setItems([]);
//                 }
//             }
//         }

//         fetchSlides();
//         return () => {
//             mounted = false;
//         };
//     }, [count, initialSlides]);

//     // Load images i minimalna liczba do pierwszego renderu
//     useEffect(() => {
//         if (!items || items.length === 0) {
//             setInitialRenderReady(true);
//             return;
//         }

//         const visibleCount = getVisibleCount();
//         let mounted = true;
//         let ready = false;

//         setInitialRenderReady(false);
//         setImagesLoaded(new Set());
//         setFadeIn(false);

//         items.forEach(slide => {
//             const img = new Image();
//             img.src = slide.imageUrl || "/placeholder.png";
//             img.onload = img.onerror = () => {
//                 if (!mounted) return;

//                 setImagesLoaded(prev => {
//                     const next = new Set(prev);
//                     next.add(slide._id);

//                     if (!ready && next.size >= visibleCount) {
//                         ready = true;
//                         setInitialRenderReady(true);
//                         setTimeout(() => setFadeIn(true), 50); // delikatny fade-in
//                     }

//                     return next;
//                 });
//             };
//         });

//         return () => {
//             mounted = false;
//         };
//     }, [items]);

//     // Spinner dopóki minimalna liczba obrazków się nie załaduje
//     if (!items || !initialRenderReady) {
//         return <CarouselLoader />;
//     }

//     if (error) {
//         return <CarouselError message={error} />;
//     }

//     if (items.length === 0) {
//         return <EmptyState icon={<SearchOffIcon />} title="No featured recipes" description="Check back later or explore all recipes" actionLabel="Browse recipes" onAction={() => router.push("/recipes")} />;
//     }

//     // Sortowanie: wczytane obrazki na początek
//     const sortedItems = items.slice().sort((a, b) => {
//         const aLoaded = imagesLoaded.has(a._id) ? 0 : 1;
//         const bLoaded = imagesLoaded.has(b._id) ? 0 : 1;
//         return aLoaded - bLoaded;
//     });

//     // Render karuzeli z podmienianiem placeholderów dla obrazków w tle i fade-in
//     return (
//         <Section>
//             <Box
//                 sx={{
//                     opacity: fadeIn ? 1 : 0,
//                     transition: "opacity 0.6s ease-in-out",
//                 }}
//             >
//                 <CarouselLib responsive={responsive} infinite autoPlay autoPlaySpeed={intervalMs} arrows keyBoardControl pauseOnHover>
//                     {sortedItems.map(slide => (
//                         <CarouselItem key={slide._id} slide={imagesLoaded.has(slide._id) ? slide : { ...slide, imageUrl: "/placeholder.png" }} />
//                     ))}
//                 </CarouselLib>
//             </Box>
//         </Section>
//     );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Box } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CarouselLib from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { EmptyState } from "@/components/EmptyState";
import { CarouselError } from "./Carousel.states";
import { Section } from "./Carousel.styles";
import { Slide } from "./Carousel.types";

import CarouselLoader from "./Carousel.loader";
import CarouselItem from "./Carousel.item";

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

export default function Carousel({ count = 5, intervalMs = 5000, initialSlides = null }: CarouselProps) {
    const [items, setItems] = useState<Slide[] | null>(initialSlides);
    const [error, setError] = useState<string | null>(null);
    const [initialRenderReady, setInitialRenderReady] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
    const router = useRouter();

    const getVisibleCount = () => {
        if (typeof window === "undefined") return 1;
        const width = window.innerWidth;
        if (width >= 1200) return 3;
        if (width >= 900) return 2;
        return 1;
    };

    // Fetch slides
    useEffect(() => {
        if (initialSlides) return;

        let mounted = true;

        async function fetchSlides() {
            try {
                const res = await fetch(`/api/recipes/random?count=${count}`, { cache: "no-store" });
                const data = await res.json();

                if (!mounted) return;

                if (Array.isArray(data)) setItems(data);
                else if (Array.isArray(data?.items)) setItems(data.items);
                else setItems([]);
            } catch (e) {
                console.error(e);
                if (mounted) {
                    setError("Failed to load carousel");
                    setItems([]);
                }
            }
        }

        fetchSlides();
        return () => {
            mounted = false;
        };
    }, [count, initialSlides]);

    // Load images
    useEffect(() => {
        if (!items || items.length === 0) {
            setInitialRenderReady(true);
            return;
        }

        const visibleCount = getVisibleCount();
        let mounted = true;
        let ready = false;

        setInitialRenderReady(false);
        setLoadedIds(new Set());
        setFadeIn(false);

        items.forEach(slide => {
            const img = new Image();
            img.src = slide.imageUrl || "/placeholder.png";
            img.onload = img.onerror = () => {
                if (!mounted) return;

                setLoadedIds(prev => {
                    const next = new Set(prev);
                    next.add(slide._id);

                    // Minimalna liczba obrazków gotowa → render karuzeli
                    if (!ready && next.size >= visibleCount) {
                        ready = true;
                        setInitialRenderReady(true);
                        setTimeout(() => setFadeIn(true), 50);
                    }

                    return next;
                });
            };
        });

        return () => {
            mounted = false;
        };
    }, [items]);

    // Spinner dopóki minimalna liczba obrazków nie załadowana
    if (!items || !initialRenderReady) {
        return <CarouselLoader />;
    }

    if (error) {
        return <CarouselError message={error} />;
    }

    if (items.length === 0) {
        return <EmptyState icon={<SearchOffIcon />} title="No featured recipes" description="Check back later or explore all recipes" actionLabel="Browse recipes" onAction={() => router.push("/recipes")} />;
    }

    // ReadyItems = tylko te, które się wczytały i są w kolejności w items
    const readyItems = items.filter(slide => loadedIds.has(slide._id));
    // PendingItems = pozostałe, też w kolejności items
    const pendingItems = items.filter(slide => !loadedIds.has(slide._id));

    const finalItems = [...readyItems, ...pendingItems];

    return (
        <Section>
            <Box
                sx={{
                    opacity: fadeIn ? 1 : 0,
                    transition: "opacity 0.6s ease-in-out",
                }}
            >
                <CarouselLib responsive={responsive} infinite autoPlay autoPlaySpeed={intervalMs} arrows keyBoardControl pauseOnHover>
                    {finalItems.map(slide => (
                        <CarouselItem key={slide._id} slide={loadedIds.has(slide._id) ? slide : { ...slide, imageUrl: "/placeholder.png" }} />
                    ))}
                </CarouselLib>
            </Box>
        </Section>
    );
}
