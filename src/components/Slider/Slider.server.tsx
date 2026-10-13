// import { Box, Typography } from "@mui/material";
// import Link from "next/link";
// import { useId } from "react";

// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// import SliderClient from "./Slider.client";
// import { styles } from "./slider.styles";
// import { CarouselContainer, EmblaContainer, EmblaSlide, EmblaViewport, Overlay, Section, SlideImage, SlideWrapper, StyledCard, AspectBox, CarouselArrow } from "../Carousel/Carousel.styles";
// import type { Slide } from "../Carousel/Carousel.types";

// interface SliderProps {
//     initialSlides?: Slide[] | null;
//     error?: string | null;
// }

// export default function SliderServer({ initialSlides = [], error = null }: SliderProps) {
//     const viewportId = useId();
//     const slides = initialSlides ?? [];

//     return (
//         <Box id="Slider" sx={styles.root}>
//             <Section>
//                 <CarouselContainer>
//                     {slides.length > 0 ? (
//                         <>
//                             <EmblaViewport id={viewportId} role="region" aria-label="Polecane przepisy" aria-roledescription="karuzela" tabIndex={0}>
//                                 <EmblaContainer>
//                                     {slides.map((slide, index) => (
//                                         <EmblaSlide key={slide._id} role="group" aria-roledescription="slajd" aria-label={`${index + 1} z ${slides.length}`}>
//                                             <SlideWrapper>
//                                                 <StyledCard>
//                                                     <Link href={slide.slug ? `/recipes/${slide.slug}` : `/recipes/${slide._id}`} prefetch={false}>
//                                                         <AspectBox>
//                                                             <SlideImage
//                                                                 src={slide.imageUrl || "/placeholder.jpg"}
//                                                                 alt={slide.title ?? "Przepis"}
//                                                                 fill
//                                                                 priority={index === 0}
//                                                                 fetchPriority={index === 0 ? "high" : "auto"}
//                                                                 loading={index === 0 ? "eager" : "lazy"}
//                                                                 quality={75}
//                                                                 sizes="(max-width: 899px) calc(100vw - 8px), (max-width: 1199px) calc(50vw - 8px), calc(33.333333vw - 8px)"
//                                                             />
//                                                             <Overlay>
//                                                                 <Typography variant="subtitle1" fontWeight={700}>
//                                                                     {slide.title ?? "Bez tytułu"}
//                                                                 </Typography>
//                                                             </Overlay>
//                                                         </AspectBox>
//                                                     </Link>
//                                                 </StyledCard>
//                                             </SlideWrapper>
//                                         </EmblaSlide>
//                                     ))}
//                                 </EmblaContainer>
//                             </EmblaViewport>

//                             {slides.length > 1 && (
//                                 <>
//                                     <CarouselArrow className="slider-prev" type="button" aria-label="Poprzednie przepisy" aria-controls={viewportId} sx={{ left: 8 }}>
//                                         <ChevronLeftIcon />
//                                     </CarouselArrow>

//                                     <CarouselArrow className="slider-next" type="button" aria-label="Następne przepisy" aria-controls={viewportId} sx={{ right: 8 }}>
//                                         <ChevronRightIcon />
//                                     </CarouselArrow>
//                                 </>
//                             )}
//                         </>
//                     ) : (
//                         <Typography role="status" sx={{ p: 2 }}>
//                             Nie ma teraz polecanych przepisów.
//                         </Typography>
//                     )}
//                 </CarouselContainer>
//             </Section>

//             <SliderClient viewportId={viewportId} intervalMs={5000} error={error} />
//         </Box>
//     );
// }

import Image from "next/image";
import Link from "next/link";
import { useId } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SliderClient from "./Slider.client";
import { design } from "@/themes/design";
import type { Slide } from "../Carousel/Carousel.types";
import css from "./Slider.server.module.css";

interface SliderProps {
    initialSlides?: Slide[] | null;
    error?: string | null;
}

export default function SliderServer({ initialSlides = [], error = null }: SliderProps) {
    const viewportId = useId();
    const slides = initialSlides ?? [];

    return (
        <section id="Slider" className={css.root} style={{ "--slider-color": design.sliderColor } as React.CSSProperties}>
            <div className={css.section}>
                <div className={css.carouselContainer}>
                    {slides.length > 0 ? (
                        <>
                            <div id={viewportId} className={css.viewport} role="region" aria-label="Polecane przepisy" aria-roledescription="karuzela" tabIndex={0}>
                                <div className={css.container}>
                                    {slides.map((slide, index) => (
                                        <div key={slide._id} className={css.slide} role="group" aria-roledescription="slajd" aria-label={`${index + 1} z ${slides.length}`}>
                                            <div className={css.slideWrapper}>
                                                <article className={css.card}>
                                                    <Link href={slide.slug ? `/recipes/${slide.slug}` : `/recipes/${slide._id}`} prefetch={false}>
                                                        <div className={css.aspectBox}>
                                                            <Image
                                                                src={slide.imageUrl || "/placeholder.jpg"}
                                                                alt={slide.title ?? "Przepis"}
                                                                fill
                                                                priority={index === 0}
                                                                fetchPriority={index === 0 ? "high" : "auto"}
                                                                sizes="(max-width: 899px) calc(100vw - 8px), (max-width: 1199px) calc(50vw - 8px), calc(33.333333vw - 8px)"
                                                                quality={75}
                                                                className={css.image}
                                                            />
                                                            <div className={css.overlay}>
                                                                <p>
                                                                    <strong>{slide.title ?? "Bez tytułu"}</strong>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </article>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {slides.length > 1 && (
                                <>
                                    <button type="button" className={`${css.arrow} ${css.previous} slider-prev`} aria-label="Poprzednie przepisy" aria-controls={viewportId}>
                                        <ChevronLeftIcon />
                                    </button>
                                    <button type="button" className={`${css.arrow} ${css.next} slider-next`} aria-label="Następne przepisy" aria-controls={viewportId}>
                                        <ChevronRightIcon />
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <p className={css.empty} role="status">
                            Nie ma teraz polecanych przepisów.
                        </p>
                    )}
                </div>
            </div>

            <SliderClient viewportId={viewportId} intervalMs={5000} error={error} />
        </section>
    );
}
