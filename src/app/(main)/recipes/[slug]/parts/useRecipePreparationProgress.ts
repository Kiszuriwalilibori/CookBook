import { useEffect, useRef, useState } from "react";

export function useRecipePreparationProgress(totalSteps: number) {
    const [activeStep, setActiveStep] = useState(0);

    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const steps = stepRefs.current.filter((step): step is HTMLDivElement => step !== null);

        if (steps.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                const visibleSteps = entries
                    .filter(entry => entry.isIntersecting)
                    .map(entry => ({
                        index: Number(entry.target.getAttribute("data-step-index")),
                        top: entry.boundingClientRect.top,
                    }));

                if (visibleSteps.length === 0) {
                    return;
                }

                const closestStep = visibleSteps.reduce((closest, current) => (Math.abs(current.top) < Math.abs(closest.top) ? current : closest));

                setActiveStep(closestStep.index);
            },
            {
                rootMargin: "-96px 0px -60% 0px",
                threshold: 0,
            }
        );

        steps.forEach(step => observer.observe(step));

        return () => observer.disconnect();
    }, [totalSteps]);

    return {
        activeStep,
        stepRefs,
    };
}

// todo on jest bardzo opóźniony w stosunku do ekranu
